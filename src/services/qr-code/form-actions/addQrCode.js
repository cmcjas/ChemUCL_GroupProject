'use server'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateAndProcessQrCode } from '../qrCodeActionHandler';

export async function addQrCodeAction(formData) {
  // Ensure formData is correctly formatted as FormData
  if (!(formData instanceof FormData)) {
    console.error('formData is not an instance of FormData');
    return { error: 'Invalid form data' };
  }

  const params = {
    type: formData.get('type'),
    locationID: formData.has('locationID') ? Number(formData.get('locationID')) : null,
    chemicalID: formData.has('chemicalID') ? Number(formData.get('chemicalID')) : null,
    // Ensure that either locationID or chemicalID is provided, but not both
  };

  // Validate and process the QR code addition
  console.log('Adding QR code with params:', params);
  const result = await validateAndProcessQrCode('add', params);

  if (result.error) {
    // Handle validation error
    return { error: result.error };
  }

  if (result) {
    revalidatePath('/inventory-page');
    redirect('/inventory-page');
  }

  // Return a success message or the added QR code object
  return { message: 'QR code added successfully', qrCode: result.qrCode };
  
}
