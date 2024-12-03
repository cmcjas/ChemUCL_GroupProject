'use server'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateAndProcessChemical } from '../chemicalActionHandler';

export async function addChemicalAction(formData) {
  // Ensure formData is correctly formatted as FormData
  if (!(formData instanceof FormData)) {
    console.error('formData is not an instance of FormData');
    return { error: 'Invalid form data' };
  }

  const researchGroupIDRaw = formData.get('researchGroupID');
  const researchGroupID = isNaN(parseInt(researchGroupIDRaw)) ? null : parseInt(researchGroupIDRaw);
  const qrCodeValue = formData.get('qrCode');

  const params = {
    chemicalName: formData.get('chemicalName'),
    qrID: qrCodeValue !== '' ? parseInt(qrCodeValue) : null,
    restrictionStatus: formData.get('restrictionStatus'),
    casNumber: formData.get('casNumber'),
    locationID: formData.has('locationID') ? Number(formData.get('locationID')) : undefined,
    researchGroupID: researchGroupID,
    researchGroup: formData.get('researchGroup') || undefined,
    supplier: formData.get('supplier'),
    description: formData.get('description'),
    quantity: formData.has('quantity') ? Number(formData.get('quantity')) : undefined,
    building: formData.get('building'),
    room: formData.get('room'),
    chemicalType: formData.get('chemicalType'),
    quartzyNumber: formData.get('quartzyNumber'),
    chemicalType: formData.get('chemicalType'),
    subLocation1: formData.get('subLocation1'),
    subLocation2: formData.get('subLocation2'),
    subLocation3: formData.get('subLocation3'),
    subLocation4: formData.get('subLocation4'),
    // Add any other fields you expect from the form
  };

  // Validate and process the chemical addition
  console.log('Adding chemical with params:', params);
  const result = await validateAndProcessChemical('add', params, '/inventory-page');

  if (result.error) {
    // Handle validation error
    return { error: result.error };
  }

  // Return a success message or the added chemical object
  return { message: 'Chemical added successfully', chemical: result.chemical };
  
}




