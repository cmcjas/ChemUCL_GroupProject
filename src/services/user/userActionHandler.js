'use server'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { z } from 'zod';
import { findUser, addUser, updateUser, deleteUser } from 'db/queries/User';

// Adjusted schema for adding a user, making most fields required
const addUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  activeStatus: z.boolean().optional().default(true),
  researchGroupID: z.number().nullable().optional(),
  permission: z.string().min(1),
});

// Existing schema for other operations, with adjustments for optional fields
const userSchema = z.object({
  userID: z.number().optional(),
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  activeStatus: z.boolean().optional(),
  researchGroupID: z.number().optional(),
  permission: z.string().min(1).optional(),
});

// Adjusted schema specifically for updating a user, making userID required
const updateUserSchema = userSchema.extend({
  userID: z.number(),
}).omit({userID: false}); // Ensure userID is required for update

//This function is used to validate the input parameters and call the relevant function from User.js
export const validateAndProcessUser = async (action, params, Path) => {
  let validationResult;

  // Use the addUserSchema for the 'add' action, the updateUserSchema for 'update', and the general userSchema for others
  if (action === 'add') {
    validationResult = addUserSchema.safeParse(params);
  } else if (action === 'update') {
    validationResult = updateUserSchema.safeParse(params);
  } else {
    validationResult = userSchema.safeParse(params);
  }

  if (!validationResult.success) {
    // Return or throw an error if validation fails
    return { error: validationResult.error.flatten() };
  }

  // Extract the validated data
  const validatedParams = validationResult.data;

  switch (action) {
    case 'find':
      // The findUser function is expected to return an array of users
      const foundUser = await findUser(validatedParams);
      
      const userWithPermission = appendAuditStatusBasedOnPermission(foundUser);

      return {users: userWithPermission};
    case 'add':
      validatedParams.activeStatus = validatedParams.activeStatus ?? true;
      // Wrap the result in an object for consistency

      const newUser = await addUser(validatedParams);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { user: newUser };
    case 'update':
      // Wrap the result in an object for consistency
      const updatedUser = await updateUser(validatedParams);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { user: updatedUser };
    case 'delete':
      if (typeof validatedParams.userID === 'undefined') {
        return { error: 'userID is required for delete action' };
      }
      // Wrap the result in an object for consistency
      const deletedUser = await deleteUser({userID: validatedParams.userID});
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { user: deletedUser };
    default:
      return { error: 'Invalid action specified' };
  }
};

const appendAuditStatusBasedOnPermission = (list) => {
  return list.map(item => {
    if (item.permission) {
      switch (item.permission) {
        case 'Admin':
        case 'Staff':
          item.auditStatus = 'Permanent';
          break;
        case 'Research Student':
          item.auditStatus = 'Unavailable';
          break;
        case 'Temporary Staff':
          item.auditStatus = 'Granted';
          break;
        default:
          break;
      }
    }
    return item;
  });
};