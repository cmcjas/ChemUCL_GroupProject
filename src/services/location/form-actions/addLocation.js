'use server'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateAndProcessLocation } from '../locationActionHandler';

export async function addLocationAction(formData) {
  // Ensure formData is correctly formatted as FormData
  if (!(formData instanceof FormData)) {
    console.error('formData is not an instance of FormData');
    return { error: 'Invalid form data' };
  }

  const params = {
    building: formData.get('building'),
    room: formData.get('room'),
    subLocation1: formData.get('subLocation1'),
    subLocation2: formData.get('subLocation2'),
    subLocation3: formData.get('subLocation3'),
    subLocation4: formData.get('subLocation4'),
    // Add any other fields you expect from the form
  };

  // Validate and process the location addition
  console.log('Adding location with params:', params);
  const result = await validateAndProcessLocation('add', params, '/location-page');

  if (result.error) {
    // Handle validation error
    return { error: result.error };
  }

  // Return a success message or the added location object
  return { message: 'Location added successfully', location: result.location };
  
}

