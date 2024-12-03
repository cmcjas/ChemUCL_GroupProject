'use server'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateAndProcessResearchGroup } from '../researchGroupActionHandler';

export async function addResearchGroupAction(formData) {
  // Ensure formData is correctly formatted as FormData
  if (!(formData instanceof FormData)) {
    console.error('formData is not an instance of FormData');
    return { error: 'Invalid form data' };
  }

  const params = {
    groupName: formData.get('groupName'),
    // Add any other fields you expect from the form
  };

  // Validate and process the research group addition
  console.log('Adding research group with params:', params);
  const result = await validateAndProcessResearchGroup('add', params);

  if (result.error) {
    // Handle validation error
    return { error: result.error };
  }

  if (result) {
    revalidatePath('/manage-user-page');
    redirect('/manage-user-page');
  }

  // Return a success message or the added research group object
  return { message: 'Research group added successfully', researchGroup: result.researchGroup };
  
}
