'use server'

import { z } from 'zod';
import { findChemical, addChemical, updateChemical, deleteChemical } from 'db/queries/Chemical';
import { findLocation, addLocation } from 'db/queries/Location';
import { revalidatePath } from 'next/cache';
import { addLog, findLog, nullLog } from 'db/queries/Log';
import { addQrCode, findQrCode } from 'db/queries/QrCode';
import { find } from 'lodash';
import { findResearchGroup, addResearchGroup } from 'db/queries/ResearchGroup';
import { validateAndProcessQrCode } from 'services/qr-code/qrCodeActionHandler';

// Base schema for chemical operations, marking fields as optional for flexibility
const baseChemicalSchema = z.object({
  chemicalID: z.number().optional(),
  chemicalName: z.string().optional(),
  casNumber: z.string().nullable().optional(),
  qrID: z.string().nullable().optional(),
  restrictionStatus: z.boolean().optional(),
  locationID: z.number().optional(),
  chemicalType: z.string().optional(),
  researchGroupID: z.number().nullable().optional(),
  activeStatus: z.boolean().optional(),
  researchGroup: z.string().optional(),
  restrictionDescription: z.string().nullable().optional(),
  supplier: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  auditStatus: z.boolean().optional(),
  lastAudit: z.date().optional(),
  quartzyNumber: z.string().nullable().optional(),
  quantity: z.number().nullable().optional(),
  building: z.string().nullable().optional(),
  room: z.string().nullable().optional(),
  subLocation1: z.string().nullable().optional(),
  subLocation2: z.string().nullable().optional(),
  subLocation3: z.string().nullable().optional(),
  subLocation4: z.string().nullable().optional(),
});

// Adjusted schema for adding a chemical, making certain fields required
const addChemicalSchema = baseChemicalSchema.extend({
  chemicalName: z.string(), // Required for adding
  restrictionStatus: z.boolean(), // Required for adding
  // description: z.string(), // Required for adding
}).omit({ activeStatus: true }).merge(z.object({
  activeStatus: z.boolean().optional().default(true), // Set default value for activeStatus
}));

// Adjusted schema specifically for updating a chemical, making chemicalID required
const updateChemicalSchema = baseChemicalSchema.omit({ chemicalID: true }).extend({
  chemicalID: z.number(), // Required for update
});



// This function is used to validate the input parameters and call the relevant function from Chemical.js
export const validateAndProcessChemical = async (action, params, Path) => {
  // Preprocess input parameters

    console.log('successfully recieved: ', params);

  if (params.hasOwnProperty('building')) {
    if (params.building === 'Charles Ingrid Building') {
      params.building = 'CIB';
    } else if (params.building === 'Kathleen Lonsdale Building') {
      params.building = 'KLB';
    }
  }
  if (params.hasOwnProperty('chemicalType')) {
    params.restrictionStatus = ['Poisons', 'Explosives', 'Chemical Weapons', 'Pyrophorics', 'Drug Precursor'].includes(params.restrictionDescription) ? true : false;
  }
  if (params.hasOwnProperty('restrictionDescription')) {
    params.restrictionStatus = ['Poisons', 'Explosives', 'Chemical Weapons', 'Pyrophorics', 'Drug Precursor', 'General Restriction'].includes(params.restrictionDescription) ? true : false;
  }

  console.log('successfully recieved appended: ', params);
  //params.researchGroupID = params.researchGroupID !== 'None' ? parseInt(params.researchGroupID) : null;

  // Example of a custom check before schema validation
  // if (!params.locationID && !(params.building && params.room && params.subLocation1)) {
  //   return { error: 'Either locationID or a combination of location fields must be provided.' };
  // }




  let validationResult;
  if (action === 'update') {
    const locationValidation = await validateLocationCombination(params);
    console.log('locationValidation', locationValidation);
    if (!locationValidation.success) {
      return { error: locationValidation.error };
    }
    validationResult = updateChemicalSchema.safeParse(params);
  } else if (action === 'add') {
    validationResult = addChemicalSchema.safeParse(params);
  } else if (action === 'update') {
    validationResult = updateChemicalSchema.safeParse(params);
  } else {
    validationResult = baseChemicalSchema.safeParse(params);
  }

  if (!validationResult.success) {
    // Return or throw an error if validation fails
    return { error: validationResult.error.flatten() };
  }

  console.log('validated params', validationResult.data);
  // Extract the validated data
  const validatedParams = await findResearchGroupID(validationResult.data, action);

  // Ensure validatedParams includes locationID
  const paramsWithLocationID = await ensureLocationID(validatedParams);

  // Additional logic to handle existing chemical check and location creation if necessary
  // if (action === 'add') {
  //   const enhancedParams = await prepareAddChemicalParams(paramsWithLocationID);
  //   console.log('params after validation and enhancement', enhancedParams);
  //   return { chemical: await addChemical(enhancedParams) };
  // }

  switch (action) {
    case 'find':
      // Use paramsWithLocationID instead of validatedParams
      console.log('params after validation', validatedParams);
      const foundChemicals = await findChemical(validatedParams);

      for (const chem of foundChemicals) {
        const qrCodeResult = await validateAndProcessQrCode('find', {chemicalID: chem.chemicalID});
        console.log('qrCodeResult', qrCodeResult);
        // Assuming qrCodeResult returns an object with a qrCodes array
        if (qrCodeResult.qrCodes && qrCodeResult.qrCodes.length > 0 && qrCodeResult.qrCodes[0].qrID !== null) {
          chem.qrID = qrCodeResult.qrCodes[0].qrID;
        }
      }  

      console.log('foundChemicals', foundChemicals);
      return { chemicals: foundChemicals };
    case 'add':
      // Use paramsWithLocationID instead of validatedParams
      console.log('params after validation', paramsWithLocationID);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      
      const hexQrID = paramsWithLocationID.qrID;

      const newChemical = await addChemical(convertHexToDecimalAndUpdate(paramsWithLocationID));

      if (newChemical.qrID !== null){
        const qrCodeResult = await validateAndProcessQrCode('update', {qrID: hexQrID ,type: 'CHEMICAL', chemicalID: newChemical.chemicalID,});
      }

      return { chemical: newChemical };

      //return updateIfExisting(paramsWithLocationID);
    case 'update':
      // Use paramsWithLocationID instead of validatedParams
      if (Path && Path !== '') {
        revalidatePath(Path);
      }

      console.log('test', paramsWithLocationID);
      const findExChemical = await findChemical({ chemicalID: paramsWithLocationID.chemicalID });
      const oldName = findExChemical[0].chemicalName;
      const oldCaseNumber = findExChemical[0].casNumber;
      const oldLocationName = findExChemical[0].location.building + ' ' + findExChemical[0].location.room + ' ' + findExChemical[0].location.subLocation1 + ' ' + findExChemical[0].location.subLocation2 + ' ' + findExChemical[0].location.subLocation3 + ' ' + findExChemical[0].location.subLocation4;
      
      const param = await findLocation({locationID: paramsWithLocationID.locationID}); // for brevity
      const building = params.building || findExChemical[0].location.building;
      const room = params.room || findExChemical[0].location.room;
      const subLocation1 = params.subLocation1 || findExChemical[0].location.subLocation1;
      const subLocation2 = params.subLocation2 || findExChemical[0].location.subLocation2;
      const subLocation3 = params.subLocation3 || findExChemical[0].location.subLocation3;
      const subLocation4 = params.subLocation4 || findExChemical[0].location.subLocation4;
      const newLocationName = `${building} ${room} ${subLocation1} ${subLocation2} ${subLocation3} ${subLocation4}`.trim();

      const createUpdateLog = await addLog({ userID:3, actionType: 'update', chemicalID: paramsWithLocationID.chemicalID, description: `Old Profile: ${oldName}, ${oldCaseNumber}, ${oldLocationName}, 
      was updated to: ${paramsWithLocationID.chemicalName}, ${paramsWithLocationID.casNumber}, ${newLocationName}` });

      const updatedChemical = await updateChemical(paramsWithLocationID);
      console.log('updatedChemical', updatedChemical);
      if (paramsWithLocationID.qrID !== null){
        const qrCodeResult = await validateAndProcessQrCode('update', {qrID: paramsWithLocationID.qrID ,type: 'CHEMICAL', chemicalID: updatedChemical.chemicalID,});
        console.log('qrCodeResult', qrCodeResult);
      }


      return { chemical: updatedChemical };
    case 'delete':
      console.log('params after validation', paramsWithLocationID);
      if (typeof paramsWithLocationID.chemicalID === 'undefined') {
        if (Path && Path !== '') {
          revalidatePath(Path);
        }
        return { error: 'chemicalID is required for delete action' };
      }
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
        // Check if there are any logs associated with the chemicalID
      const relatedLogs = await findLog({ chemicalID: paramsWithLocationID.chemicalID });
      // If there are related logs, update them first
      if (relatedLogs.length > 0) {
        await nullLog({ chemicalID: paramsWithLocationID.chemicalID });
      };

      const chemical = await findChemical({ chemicalID: paramsWithLocationID.chemicalID });
      const chemicalName = chemical[0].chemicalName;
      const supplier = chemical[0].supplier;
      const locationName = chemical[0].location.building + ' ' + chemical[0].location.room + ' ' + chemical[0].location.subLocation1 + ' ' + chemical[0].location.subLocation2 + ' ' + chemical[0].location.subLocation3 + ' ' + chemical[0].location.subLocation4;

      const createDeleteLog = await addLog({ userID:3, actionType: 'delete', chemicalID: paramsWithLocationID.chemicalID, description: `${chemicalName}, ${supplier}, was removed from inventory, ${locationName}` });

      if (createDeleteLog) {
        return { result: await deleteChemical({ chemicalID: paramsWithLocationID.chemicalID }) };
      }
      // Wrap the result in an object for consistency
      // return { result: await deleteChemical(paramsWithLocationID.chemicalID) };
    default:
      return { error: 'Invalid action specified' };
  }
};


// Function to ensure validatedParams includes locationID
const ensureLocationID = async (validatedParams) => {
  // Create a copy of validatedParams to avoid altering the original data
  const paramsCopy = { ...validatedParams };

  // If locationID is already present or if paramsCopy is empty, return the copy as is
  if (Object.keys(paramsCopy).length === 0 || paramsCopy.locationID) {
    return paramsCopy;
  }

  // Check if location details are present
  const locationDetails = {
    building: paramsCopy.building,
    room: paramsCopy.room,
    subLocation1: paramsCopy.subLocation1,
    subLocation2: paramsCopy.subLocation2,
    subLocation3: paramsCopy.subLocation3,
    subLocation4: paramsCopy.subLocation4,
  };

  // Check if any location detail is present
  const hasLocationDetails = Object.values(locationDetails).some(detail => detail !== undefined);

  if (!hasLocationDetails) {
    // Return the original validatedParams if no location details are provided
    return validatedParams;
  }

  // Use findLocation query to attempt to find the locationID
  const foundLocations = await findLocation(locationDetails);

  // Assuming findLocation returns an array and we're interested in the first match
  if (foundLocations && foundLocations.length > 0) {
    // Update paramsCopy with the found locationID
    paramsCopy.locationID = foundLocations[0].locationID;
    // Remove location details from paramsCopy to avoid confusion
    delete paramsCopy.building;
    delete paramsCopy.room;
    delete paramsCopy.subLocation1;
    delete paramsCopy.subLocation2;
    delete paramsCopy.subLocation3;
    delete paramsCopy.subLocation4;
  } else {
    // Handle the case where no matching location is found
    const newLocation = await addLocation(locationDetails);
    paramsCopy.locationID = newLocation.locationID;
  } 

  return paramsCopy;
};

const updateIfExisting = async (params) => {
  // Check if a chemical with the same name, supplier, and locationName already exists
  // const existingChemical = await db.Chemical.findFirst({
  //     where: {
  //         chemicalName: params.chemicalName,
  //         supplier: params.supplier,
  //         locationName: params.locationName,
  //     },

  const minimumParams = {
      chemicalName: params.chemicalName,
      supplier: params.supplier,
      locationID: params.locationID,
  };


  let existingChemical = await findChemical(minimumParams);

  if (existingChemical && existingChemical.length > 0) {
      const updatedChemical = await updateChemical({chemicalID: existingChemical[0].chemicalID, quantity: existingChemical[0].quantity + 1});
      return { chemical: updatedChemical };
  }
   // If no existing chemical, return params as is or with any additional modifications needed
  console.log('test', params);
  const chemical = await addChemical(params);


  existingChemical = await findChemical(minimumParams);

  if (params.qrID) {
    const addQR = await addQrCode({chemicalID: existingChemical[0].chemicalID, type: 'CHEMICAL'});
  }

  if (existingChemical && existingChemical.length > 0) {
    const locationName = existingChemical[0].location.building + ' ' + existingChemical[0].location.room + ' ' + existingChemical[0].location.subLocation1 + ' ' + existingChemical[0].location.subLocation2 + ' ' + existingChemical[0].location.subLocation3 + ' ' + existingChemical[0].location.subLocation4;
    const createAddLog = await addLog({ userID:3, actionType: 'add', chemicalID: existingChemical[0].chemicalID, description: `${existingChemical[0].chemicalName}, 
    ${existingChemical[0].supplier}, was added to inventory, ${locationName}` });
  }

  return { chemical };

};


const findResearchGroupID = async (validatedParams, action) => {
  if (validatedParams.researchGroup && validatedParams.researchGroup !== null) {
    // Attempt to find the research group by name
    const foundResearchGroups = await findResearchGroup({ groupName: validatedParams.researchGroup });
 
    // Check if the research group was found
    if (foundResearchGroups.length > 0) {
      // Set the researchGroupID from the first found group
      validatedParams.researchGroupID = foundResearchGroups[0].researchGroupID;
    } else {
      // If not found, add the new research group only if the action is not 'update'
      if (action !== 'update') {
        const newResearchGroup = await addResearchGroup({ groupName: validatedParams.researchGroup });
        // Set the researchGroupID from the newly created group
        validatedParams.researchGroupID = newResearchGroup.researchGroupID;
      }
    }
  }
  return validatedParams;
}

const convertHexToDecimalAndUpdate = (params) => {
  if (params.qrID) {
    params.qrID = parseInt(params.qrID, 16);
  }
  return params;
}

const validateLocationCombination = async (params) => {
  const { building, room, subLocation1, subLocation2, subLocation3, subLocation4 } = params;
  const locationDetails = { building, room, subLocation1, subLocation2, subLocation3, subLocation4 };
  const foundLocations = await findLocation(locationDetails);
  if (!foundLocations || foundLocations.length === 0) {
    return { error: 'Location combination does not exist. Double check please.' };
  }
  return { success: true };
}
