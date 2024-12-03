'use server'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateAndProcessLog } from '../logActionHandler';

export async function addLogAction(formData) {
  // Ensure formData is correctly formatted as FormData
  if (!(formData instanceof FormData)) {
    console.error('formData is not an instance of FormData');
    return { error: 'Invalid form data' };
  }

  const params = {
    userID: formData.has('userID') ? Number(formData.get('userID')) : undefined,
    actionType: formData.get('actionType'),
    entityType: formData.get('entityType'),
    entityId: formData.has('entityId') ? Number(formData.get('entityId')) : undefined,
    description: formData.get('description'),
    // Add any other fields you expect from the form
  };

  // Validate and process the log addition
  console.log('Adding log with params:', params);
  const result = await validateAndProcessLog('add', params);

  if (result.error) {
    // Handle validation error
    return { error: result.error };
  }

  if (result) {
    revalidatePath('/system-logs-page');
    redirect('/system-logs-page');
  }

  // Return a success message or the added log object
  return { message: 'Log added successfully', log: result.log };
  
}
