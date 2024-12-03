'use server'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateAndProcessLocation } from '../locationActionHandler';

export async function updateLocationAction(formData) {
  // Ensure formData is correctly formatted as FormData
  if (!(formData instanceof FormData)) {
    console.error('formData is not an instance of FormData');
    return { error: 'Invalid form data' };
  }

  const params = {
    locationID: formData.has('locationID') ? Number(formData.get('locationID')) : undefined,
    building: formData.get('building'),
    room: formData.get('room'),
    subLocation1: formData.get('subLocation1'),
    subLocation2: formData.get('subLocation2'),
    subLocation3: formData.get('subLocation3'),
    subLocation4: formData.get('subLocation4'),
    // Add any other fields you expect from the form
  };

  // Validate and process the location update
  console.log('Updating location with params:', params);
  const result = await validateAndProcessLocation('update', params, '/location-page');

  if (result.error) {
    // Handle validation error
    return { error: result.error };
  }

  if (result) {
    revalidatePath('/location-page');
    redirect('/location-page');
  }

  // Return a success message or the updated location object
  return { message: 'Location updated successfully', location: result.location };
  
}
revalidatePath('/manage-locations');