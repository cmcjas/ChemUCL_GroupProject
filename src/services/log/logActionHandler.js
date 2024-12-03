'use server'

import { z } from 'zod';
import { findLog, addLog} from 'db/queries/Log';
import { revalidatePath } from 'next/cache';

// Base schema for log operations, marking fields as optional for flexibility
const baseLogSchema = z.object({
  logID: z.number().optional(),
  userID: z.number().optional(),
  actionType: z.string().optional(),
  entityType: z.string().optional(),
  entityID: z.number().optional(),
  description: z.string().optional(),
});

// Adjusted schema for adding a log, making certain fields required
const addLogSchema = baseLogSchema.extend({
  userID: z.number(), // Required for adding
  actionType: z.string(), // Required for adding
  entityType: z.string(), // Required for adding
  entityID: z.number(), // Required for adding
  description: z.string(), // Required for adding
});

// Adjusted schema specifically for updating a log, making logID and description required
const updateLogSchema = baseLogSchema.extend({
  logID: z.number(), // Required for update
  description: z.string(), // Required for update
});

// This function is used to validate the input parameters and call the relevant function from Log.js
export const validateAndProcessLog = async (action, params, Path) => {
  let validationResult;

  // Use the addLogSchema for the 'add' action, the updateLogSchema for 'update', and the baseLogSchema for others
  if (action === 'add') {
    validationResult = addLogSchema.safeParse(params);
  } else if (action === 'update') {
    validationResult = updateLogSchema.safeParse(params);
  } else {
    validationResult = baseLogSchema.safeParse(params);
  }

  if (!validationResult.success) {
    // Return or throw an error if validation fails
    return { error: validationResult.error.flatten() };
  }

  // Extract the validated data
  const validatedParams = validationResult.data;

  switch (action) {
    case 'find':
      const foundLogs = await findLog({validatedParams});
      return { logs: foundLogs };
    case 'add':
      const newLog = await addLog(validatedParams);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { log: newLog };
    case 'update':
      if (typeof validatedParams.logID === 'undefined') {
        return { error: 'logID is required for update action' };
      }
      const updatedLog = await updateLog(validatedParams);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { log: updatedLog };
    case 'delete':
      if (typeof validatedParams.logID === 'undefined') {
        return { error: 'logID is required for delete action' };
      }
      const deletedLog = await deleteLog(validatedParams.logID);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { log: deletedLog };
    default:
      return { error: 'Invalid action specified' };
  }
};