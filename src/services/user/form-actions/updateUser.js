'use server'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateAndProcessUser } from '../userActionHandler';

export async function updateUserAction(formData) {
  // Ensure formData is correctly formatted as FormData
  if (!(formData instanceof FormData)) {
    console.error('formData is not an instance of FormData');
    return { error: 'Invalid form data' };
  }

  const params = {
    userID: formData.has('userID') ? Number(formData.get('userID')) : undefined,
    email: formData.get('email'),
    name: formData.get('name'),
    activeStatus: formData.get('activeStatus') === 'true',
    researchGroupID: formData.has('researchGroupID') ? Number(formData.get('researchGroupID')) : undefined,
    permission: formData.get('permission'),
    // Add any other fields you expect from the form
  };

  // Validate and process the user update
  console.log('Updating user with params:', params);
  const result = await validateAndProcessUser('update', params);

  if (result.error) {
    // Handle validation error
    return { error: result.error };
  }

  if (result) {
    revalidatePath('/manage-user-page');
    redirect('/manage-user-page');
  }

  // Return a success message or the updated user object
  return { message: 'User updated successfully', user: result.user };
  
}