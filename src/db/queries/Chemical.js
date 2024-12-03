'use server';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { log } from 'console';
import { db } from 'db/index'

export const findChemical = async (params) => {
    const { chemicalID, casNumber, chemicalName, restrictionStatus, researchGroupID, activeStatus, locationID, restrictionDescription, lastAudit, quartzyNumber, page, rowsPerPage } = params;
    let whereClause = {};


    if (chemicalID) whereClause.chemicalID = chemicalID;
    if (casNumber) whereClause.casNumber = casNumber;
    if (chemicalName) whereClause.chemicalName = chemicalName;
    if (restrictionStatus !== undefined) whereClause.restrictionStatus = restrictionStatus;
    if (researchGroupID) whereClause.researchGroupID = researchGroupID;
    if (activeStatus !== undefined) whereClause.activeStatus = activeStatus;
    if (locationID) whereClause.locationID = locationID;
    if (restrictionDescription) whereClause.restrictionDescription = restrictionDescription;
    if (lastAudit) whereClause.lastAudit = lastAudit;
    if (quartzyNumber) whereClause.quartzyNumber = quartzyNumber;

    console.log('whereClause: ', whereClause)

    if(page && rowsPerPage) {
      const skip = page * rowsPerPage;
      const take = rowsPerPage;
    
      if (Object.keys(whereClause).length === 0) {
        return await db.chemical.findMany({
            skip: skip,
            take: take,
            include: {
                researchGroup: true,
                location: true,
            }, 
        });
      }

      return await db.chemical.findMany({
        where: whereClause,
        skip: skip,
        take: take,
        include: {
            researchGroup: true,
            location: true,
        },
      });
    }

    if (Object.keys(whereClause).length === 0) {
      return await db.chemical.findMany({
          include: {
              researchGroup: true,
              location: true,
          }, 
      });
  }

  return await db.chemical.findMany({
      where: whereClause,
      include: {
          researchGroup: true,
          location: true,
      }, 
  });
};


export const addChemical = async (params) => {
    const { qrID, casNumber, chemicalName, chemicalType, restrictionStatus, locationID, researchGroup, supplier, description, auditStatus, quartzyNumber, quantity, activeStatus, restrictionDescription } = params;
    
    // Find the research group based on the provided research group name
    const foundResearchGroup = await db.researchGroup.findFirst({
        where: {
            groupName: researchGroup,
        },
    });

    // Check if the research group exists
    if (!foundResearchGroup) {
        throw new Error(`Research group with name '${researchGroup}' does not exist.`);
    }

    // Prepare data object conditionally
    let data = {
        casNumber,
        chemicalName,
        chemicalType,
        restrictionStatus,
        supplier,
        description,
        auditStatus,
        quartzyNumber,
        quantity,
        qrID,
        activeStatus,
        restrictionDescription,
        researchGroup: {
            connect: { researchGroupID: foundResearchGroup.researchGroupID },
        },
        location: {
            connect: { locationID },
        },
    };

    // Remove undefined fields
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
    if (data.location.connect.locationID === undefined) {
        delete data.location;
    }

    return await db.chemical.create({ data });
};

export const updateChemical = async (params) => {
    console.log('updateChemical params: ', params);
    const { chemicalID, casNumber, chemicalName, restrictionStatus, locationID, researchGroupID, supplier, description, auditStatus, lastAudit, quartzyNumber, quantity, restrictionDescription, activeStatus } = params;
    const paramData = {};
    
    if(chemicalName) paramData.chemicalName = chemicalName;
    if(casNumber) paramData.casNumber = casNumber;
    if(restrictionStatus) paramData.restrictionStatus = restrictionStatus;
    if(locationID) paramData.location = {
        connect: { locationID },
    };
    if(researchGroupID) paramData.researchGroup = {
        connect: { researchGroupID },
    };
    if(lastAudit) paramData.lastAudit = new Date(lastAudit);
    if(supplier) paramData.supplier = supplier;
    if(description) paramData.description = description;
    if(auditStatus !== undefined) paramData.auditStatus = auditStatus;
    if(quartzyNumber) paramData.quartzyNumber = quartzyNumber;
    if(quantity) paramData.quantity = quantity;
    if(activeStatus) paramData.activeStatus = activeStatus;
    if(restrictionDescription) paramData.restrictionDescription = restrictionDescription;

    console.log('paramData: ', paramData);
    
    
    return await db.chemical.update({
        where: { chemicalID },
        data: paramData,
    });
};

export const deleteChemical = async (chemicalID) => {


  // Check if there are any logs associated with the chemicalID
//   const relatedLogs = await db.log.findMany({
//       where: chemicalID,
//   });

//   // If there are related logs, update them first
//   if (relatedLogs.length > 0) {
//       await db.log.updateMany({
//           where: chemicalID,
//           data: { chemicalID: null },
//       });
//   }

//   const findChemName = await db.Chemical.findUnique({
//     where: {
//         chemicalID: chemicalID.chemicalID,
//     },
//     select: {
//         chemicalName: true, // Only fetch the chemicalID
//     },
//   });

//   const logDelete = await db.log.create({
//     data: {
//       userID: 3,
//       actionType: 'Deleted',
//       chemicalID: chemicalID.chemicalID,
//       description: `${findChemName.chemicalName}, removed from inventory`,
//     },
//   });

//   // Proceed to delete the chemical after updating/deleting logs
//   if (logDelete) {
    const delChem = await db.chemical.delete({
        where: chemicalID,
    });

};