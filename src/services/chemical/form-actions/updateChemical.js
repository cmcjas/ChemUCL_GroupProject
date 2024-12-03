'use server'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateAndProcessChemical } from 'src/services/chemical/chemicalActionHandler';

export async function updateChemicalAction(formData) {
  // Ensure formData is correctly formatted as FormData
  if (!(formData instanceof FormData)) {
    console.error('formData is not an instance of FormData');
    return { error: 'Invalid form data' };
  }

  const params = {
    chemicalID: formData.has('chemicalID') ? Number(formData.get('chemicalID')) : undefined,
    chemicalName: formData.get('chemicalName'),
    casNumber: formData.get('casNumber'),
    restrictionStatus: formData.get('restrictionStatus') === 'true',
    locationID: formData.has('locationID') ? Number(formData.get('locationID')) : undefined,
    researchGroup: formData.get('researchGroup') || undefined,
    supplier: formData.get('supplier'),
    description: formData.get('description'),
    quantity: formData.has('quantity') ? Number(formData.get('quantity')) : undefined,
    building: formData.get('building'),
    room: formData.get('room'),
    subLocation1: formData.get('subLocation1'),
    subLocation2: formData.get('subLocation2'),
    subLocation3: formData.get('subLocation3'),
    subLocation4: formData.get('subLocation4'),
    // Add any other fields you expect from the form
  };

  // Validate and process the chemical update
  console.log('Updating chemical with params:', params);
  const result = await validateAndProcessChemical('update', params);

  if (result.error) {
    // Handle validation error
    return { error: result.error };
  }

  if (result) {
    revalidatePath('/inventory-page');
    redirect('/inventory-page');
  }

  // Return a success message or the updated chemical object
  return { message: 'Chemical updated successfully', chemical: result.chemical };
  
}
revalidatePath('/manage-chemicals');