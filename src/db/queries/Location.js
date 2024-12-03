'use server';
import { db } from 'db/index'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export const findLocation = async (params) => {
  let { locationID, building, room, subLocation1, subLocation2, subLocation3, subLocation4, locationName, page, rowsPerPage } = params;
  let whereClause = {};
  const skip = page * rowsPerPage;
  const take = rowsPerPage;

  if (locationID) whereClause.locationID = locationID;
  if (building) whereClause.building = building;
  if (room) whereClause.room = room;
  if (subLocation1) whereClause.subLocation1 = subLocation1;
  if (subLocation2) whereClause.subLocation2 = subLocation2;
  if (subLocation3) whereClause.subLocation3 = subLocation3;
  if (subLocation4) whereClause.subLocation4 = subLocation4;

  if (locationName) {
    page = undefined;  
    rowsPerPage = undefined;  
  
    whereClause = {
      OR: [
        {
          building: {
            contains: locationName,
            mode: 'insensitive',
          }
        },
        {
          room: {
            contains: locationName,
            mode: 'insensitive',
          }
        },
        {
          subLocation1: {
            contains: locationName,
            mode: 'insensitive',
          }
        },
        {
          subLocation2: {
            contains: locationName,
            mode: 'insensitive',
          }
        },
        {
          subLocation3: {
            contains: locationName,
            mode: 'insensitive',
          }
        },
        {
          subLocation4: {
            contains: locationName,
            mode: 'insensitive',
          }
        }
      ]
    };
  }

  // Calculate skip and take for pagination
  if (page !== undefined && rowsPerPage !== undefined) {
    if (Object.keys(whereClause).length === 0) {
        return await db.Location.findMany({
            skip: skip,
            take: take,
        });
    }

    return await db.Location.findMany({
        where: whereClause,
        skip: skip,
        take: take,
    });
  };

if (Object.keys(whereClause).length === 0) {
  return await db.Location.findMany();
}

return await db.Location.findMany({
    where: whereClause,
});

};

export const addLocation = async (params) => {
    const { building, room, subLocation1, subLocation2, subLocation3, subLocation4 } = params;
  
    try {
      const newLocation = await db.location.create({
        data: {
          building,
          room,
          subLocation1,
          subLocation2,
          subLocation3,
          subLocation4,
        },
      });
      return newLocation;
    } catch (error) {
      console.error("Error creating location:", error);
      throw new Error('Failed to create location. Please try again.');
    }
  };

export const updateLocation = async (params) => {
    const { locationID, building, room, subLocation1, subLocation2, subLocation3, subLocation4 } = params;
    const paramData = {};

    if(building) paramData.building = building;
    if(room) paramData.room = room;
    if(subLocation1) paramData.subLocation1 = subLocation1;
    if(subLocation2) paramData.subLocation2 = subLocation2;
    if(subLocation3) paramData.subLocation3 = subLocation3;
    if(subLocation4) paramData.subLocation4 = subLocation4;

    return await db.location.update({
        where: { locationID },
        data: paramData,
    });
};

export const deleteLocation = async (locationID) => {
     const delLoc = await db.location.delete({
        where:  locationID ,
    });
};

