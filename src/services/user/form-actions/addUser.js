'use server'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateAndProcessUser } from 'services/user/userActionHandler';

export async function addUserAction(formData) {
  // Ensure formData is correctly formatted as FormData
  if (!(formData instanceof FormData)) {
    console.error('formData is not an instance of FormData');
    return { error: 'Invalid form data' };
  }

  const researchGroupIDRaw = formData.get('researchGroupID');
  const researchGroupID = isNaN(parseInt(researchGroupIDRaw)) ? null : parseInt(researchGroupIDRaw);

  const params = {
    email: formData.get('email'),
    name: formData.get('name'),
    // Assuming 'role' maps to 'permission' in your schema
    permission: formData.get('permission'),
    // Convert research_group to a number, as your schema expects a number
    researchGroupID: researchGroupID,
    // Add any other fields you expect from the form
  };

  // Validate and process the user addition
  console.log('Adding user with params:', params);
  const result = await validateAndProcessUser('add', params);

  if (result.error) {
    // Handle validation error
    return { error: result.error };
  }

  if (result) {
    revalidatePath('/manage-user-page');
    redirect('/manage-user-page');
  }

  // Return a success message or the added user object
  return { message: 'User added successfully', user: result.user };
  
}
revalidatePath('/manage-users');


