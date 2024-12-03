'use server'

import { z } from 'zod';
import { findQrCode, addQrCode, updateQrCode, deleteQrCode, lastQrCode } from 'db/queries/QrCode';
import { findChemical, updateChemical } from 'db/queries/Chemical';
import { findLocation } from 'db/queries/Location';
import { revalidatePath } from 'next/cache';

// Enum for QR code types
const QrCodeType = z.enum(['CHEMICAL', 'LOCATION', 'NEW']);

// Base schema for QR code operations, marking fields as optional for flexibility
const baseQrCodeSchema = z.object({
  qrID: z.string().regex(/^[0-9a-fA-F]+$/).optional(), // Ensure qrID is a hexadecimal string
  type: QrCodeType.optional(),
  locationID: z.number().optional().nullable(),
  chemicalID: z.number().optional().nullable(),
});

// Adjusted schema for adding a QR code, making type required
const addQrCodeSchema = baseQrCodeSchema.extend({
  type: QrCodeType, // Required for adding
  // Note: Either locationID or chemicalID should be provided, but not both. This logic needs to be handled in code.
});

// Adjusted schema specifically for updating a QR code, making qrID required
const updateQrCodeSchema = baseQrCodeSchema.extend({
  qrID: z.string().regex(/^[0-9a-fA-F]+$/), // Ensure qrID is a hexadecimal string and required for update
  // Note: Either locationID or chemicalID can be updated, but not both. This logic needs to be handled in code.
});

const scanQrCodeSchema = baseQrCodeSchema.extend({
    qrID: z.string().regex(/^[0-9a-fA-F]+$/), // Ensure qrID is a hexadecimal string and is required by default
}).omit('type', 'locationID', 'chemicalID');

// This function is used to validate the input parameters and call the relevant function from QrCode.js
export const validateAndProcessQrCode = async (action, params, Path) => {
  let validationResult;

  if (action === 'add') {
    validationResult = addQrCodeSchema.safeParse(params);
  } else if (action === 'update') {
    validationResult = updateQrCodeSchema.safeParse(params);
  } else {
    validationResult = baseQrCodeSchema.safeParse(params);
  }

  if (!validationResult.success) {
    return { error: validationResult.error.flatten() };
  }

  const validationReturn = validationResult.data;

  const validatedParams = convertHexToDecimalAndUpdate(validationReturn);

  if ((action === 'add' || action === 'update') && validatedParams.type !== 'NEW') {
    if ((validatedParams.locationID && validatedParams.chemicalID) || (!validatedParams.locationID && !validatedParams.chemicalID)) {
      return { error: 'Either locationID or chemicalID must be provided, but not both.' };
    }
  }

  switch (action) {
    case 'find':
      const foundQrCodes = await findQrCode(validatedParams);

      for (const qrCode of foundQrCodes) {
        qrCode.qrID = convertDecimalToHexAndUpdate(qrCode.qrID);
      }

      return { qrCodes: foundQrCodes };
    case 'add':
      const newQrCode = await addQrCode(validatedParams);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { qrCode: newQrCode };
    case 'update':
      if (typeof validatedParams.qrID === 'undefined') {
        return { error: 'qrID is required for update action' };
      }
      const updatedQrCode = await updateQrCode(validatedParams);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { qrCode: updatedQrCode };

    case 'scan':
        console.log(`Scanning for QR code with ID: ${validatedParams.qrID}`);
        let result = await findQrCode({ qrID: validatedParams.qrID });
        console.log(`Scan result: ${JSON.stringify(result)}`);

        // If QR code does not exist, add it to the database
        if (result.length === 0) {
            console.log('QR code not found, adding to the database.');
            result = await addQrCode({ qrID: validatedParams.qrID, type: 'NEW' }); // Assuming default type 'NEW'
            result = [result]; // Adjusting the result to match expected format
        }

        // Proceed with existing logic
        if (result[0].type === null || result[0].type === 'NEW') {
            console.log('No QR link found, returning as new.');
            return { type: 'NEW', qrID: convertDecimalToHexAndUpdate(validatedParams.qrID) };
        } else {
            console.log('QR code found, processing for return.');
            const qrCodeData = result[0];
            console.log('QR code data:', qrCodeData);
            if (qrCodeData.type === 'CHEMICAL') {

                const chemical = await findChemical({ chemicalID: qrCodeData.chemicalID });

                const chemicalLocation = await findLocation({locationID: chemical[0].locationID});

                chemical[0].building = chemicalLocation[0].building;
                chemical[0].room = chemicalLocation[0].room;
                chemical[0].subLocation1 = chemicalLocation[0].subLocation1;
                chemical[0].subLocation2 = chemicalLocation[0].subLocation2;
                chemical[0].subLocation3 = chemicalLocation[0].subLocation3;
                chemical[0].subLocation4 = chemicalLocation[0].subLocation4;
                chemical[0].qrID = convertDecimalToHexAndUpdate(validationResult.data.qrID);

                console.log('Chemical data:', chemical);
                return { type: 'CHEMICAL', data: chemical };
            } else if (qrCodeData.type === 'LOCATION') {
                const location = await findLocation({ locationID: qrCodeData.locationID });
                location[0].qrID = convertDecimalToHexAndUpdate(validationResult.data.qrID);
                console.log('Location data:', location);
                return { type: 'LOCATION', data: location };
            }
        }
        case 'latest':
            const lastQRCode = await lastQrCode();
            return { qrID: lastQRCode.qrID };
    case 'delete':
      if (typeof validatedParams.qrID === 'undefined') {
        return { error: 'qrID is required for delete action' };
      }
      const deletedQrCode = await deleteQrCode(validatedParams.qrID);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { qrCode: deletedQrCode };

    case 'audit':
      const qrCode = await findQrCode({ qrID: validatedParams.qrID });
      const qrCodeData = qrCode[0];

      const chemicalSearch = await findChemical({chemicalID: qrCodeData.chemicalID});
      const chemicalLinkedToQR = chemicalSearch[0];

      console.log(chemicalLinkedToQR.locationID);
      console.log(validatedParams.locationID);

      if(chemicalLinkedToQR.locationID !== validatedParams.locationID){
        return {error: 'Chemical is not linked to this location'}
      }

      const updateAuditedChemical = await updateChemical({chemicalID: qrCodeData.chemicalID, lastAudit: new Date(), auditStatus: true});
      return { chemical: updateAuditedChemical };

    default:
      return { error: 'Invalid action specified' };
  }
};

const convertHexToDecimalAndUpdate = (params) => {
  if (params.qrID) {
    params.qrID = parseInt(params.qrID, 16);
  }
  return params;
}

const convertDecimalToHexAndUpdate = (qrID) => {
  return parseInt(qrID).toString(16).toUpperCase();
}

