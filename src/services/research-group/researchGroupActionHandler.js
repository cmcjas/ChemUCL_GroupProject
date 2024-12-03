'use server'

import { z } from 'zod';
import { findResearchGroup, addResearchGroup, updateResearchGroup, deleteResearchGroup } from 'db/queries/ResearchGroup';
import { revalidatePath } from 'next/cache';

// Base schema for research group operations, marking fields as optional for flexibility
const baseResearchGroupSchema = z.object({
  researchGroupID: z.number().optional(),
  groupName: z.string().optional(),
});

// Adjusted schema for adding a research group, making groupName required
const addResearchGroupSchema = baseResearchGroupSchema.extend({
  groupName: z.string(), // Required for adding
});

// Adjusted schema specifically for updating a research group, making groupID required
const updateResearchGroupSchema = baseResearchGroupSchema.extend({
  researchGroupID: z.number(), // Required for update
  groupName: z.string().optional(), // groupName is optional in update as you might not want to change it every time
});

// This function is used to validate the input parameters and call the relevant function from ResearchGroup.js
export const validateAndProcessResearchGroup = async (action, params, Path) => {
  let validationResult;

  // Use the addResearchGroupSchema for the 'add' action, the updateResearchGroupSchema for 'update', and the baseResearchGroupSchema for others
  if (action === 'add') {
    validationResult = addResearchGroupSchema.safeParse(params);
  } else if (action === 'update') {
    validationResult = updateResearchGroupSchema.safeParse(params);
  } else {
    validationResult = baseResearchGroupSchema.safeParse(params);
  }

  if (!validationResult.success) {
    // Return or throw an error if validation fails
    return { error: validationResult.error.flatten() };
  }

  // Extract the validated data
  const validatedParams = validationResult.data;

  switch (action) {
    case 'find':
      const foundResearchGroups = await findResearchGroup(validatedParams);
      return { researchGroups: foundResearchGroups };
    case 'add':
      const newResearchGroup = await addResearchGroup(validatedParams);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { researchGroup: newResearchGroup };
    case 'update':
      if (typeof validatedParams.researchGroupID === 'undefined') {
        return { error: 'researchGroupID is required for update action' };
      }
      const updatedResearchGroup = await updateResearchGroup(validatedParams);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { researchGroup: updatedResearchGroup };
    case 'delete':
      if (typeof validatedParams.researchGroupID === 'undefined') {
        return { error: 'researchGroupID is required for delete action' };
      }
      const deletedResearchGroup = await deleteResearchGroup(validatedParams.groupID);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { researchGroup: deletedResearchGroup };
    default:
      return { error: 'Invalid action specified' };
  }
  
};