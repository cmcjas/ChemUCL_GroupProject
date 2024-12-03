'use server'

import { z } from 'zod';
import { findLocation, addLocation, updateLocation, deleteLocation } from 'db/queries/Location';
import { revalidatePath } from 'next/cache';

// Base schema for location operations, marking fields as optional for flexibility
const baseLocationSchema = z.object({
  locationID: z.number().optional(),
  building: z.string().optional(),
  room: z.string().optional(),
  subLocation1: z.string().nullable().optional(),
  subLocation2: z.string().nullable().optional(),
  subLocation3: z.string().nullable().optional(),
  subLocation4: z.string().nullable().optional(),
});

// Adjusted schema for adding a location, making certain fields required
const addLocationSchema = baseLocationSchema.extend({
  building: z.string(), // Required for adding
  room: z.string(), // Required for adding
});

// Adjusted schema specifically for updating a location, making locationID required
const updateLocationSchema = baseLocationSchema.extend({
  locationID: z.number(), // Required for update
});

// This function is used to validate the input parameters and call the relevant function from Location.js
export const validateAndProcessLocation = async (action, params, Path) => {
  let validationResult;
  
  if (action !== 'find'){
    params.building = params.building === 'Charles Ingrid Building' ? 'CIB' : 'B2';
  }


  // Use the addLocationSchema for the 'add' action, the updateLocationSchema for 'update', and the baseLocationSchema for others
  if (action === 'add') {
    validationResult = addLocationSchema.safeParse(params);
  } else if (action === 'update') {
    validationResult = updateLocationSchema.safeParse(params);
  } else {
    validationResult = baseLocationSchema.safeParse(params);
  }

  if (!validationResult.success) {
    // Return or throw an error if validation fails
    return { error: validationResult.error.flatten() };
  }

  // Extract the validated data
  const validatedParams = validationResult.data;
  console.log('successfully recieved: ', validatedParams);

  switch (action) {
    case 'find':
  const foundLocations = await findLocation(validatedParams);
  const locationsWithName = foundLocations.map(location => ({
    ...location,
    locationName: `${location.building} ${location.room} ${location.subLocation1} ${location.subLocation2} ${location.subLocation3} ${location.subLocation4}`,
  }));
  return { locations: locationsWithName };
    case 'add':
      const newLocation = await addLocation(validatedParams);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      // const newLocationID = await findLocation({ location })

      return { location: newLocation };
    case 'update':
      if (typeof validatedParams.locationID === 'undefined') {
        return { error: 'locationID is required for update action' };
      }
      const updatedLocation = await updateLocation(validatedParams);
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { location: updatedLocation };
    case 'delete':
      if (typeof validatedParams.locationID === 'undefined') {
        return { error: 'locationID is required for delete action' };
      }
      const deletedLocation = await deleteLocation({locationID: validatedParams.locationID});
      if (Path && Path !== '') {
        revalidatePath(Path);
      }
      return { location: deletedLocation };
    default:
      return { error: 'Invalid action specified' };
  }
};
