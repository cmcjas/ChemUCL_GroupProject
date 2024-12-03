'use server';
import { db } from 'db/index'

export const findLog = async (params, page = 0, rowsPerPage = 25) => {
    const { logID, userID, actionType, chemicalID, description } = params;
    let whereClause = {};

    if (logID) whereClause.logID = logID;
    if (userID) whereClause.userID = userID;
    if (actionType) whereClause.actionType = actionType;
    // if (chemicalID) whereClause.entityType = chemicalID; // Assuming entityType should be chemicalID based on your context
    if (chemicalID) whereClause.chemicalID = chemicalID;
    if (description) whereClause.description = description;

    // Handling pagination similarly to findChemical
    if (page !== undefined && rowsPerPage !== undefined) {
        const skip = page * rowsPerPage;
        const take = rowsPerPage;

        if (Object.keys(whereClause).length === 0) {
            return await db.log.findMany({
                skip: skip,
                take: take,
                include: {
                    user: true,
                    chemical: {
                        include: {
                            location: true, // Include the location related to the chemical
                        },
                    },
                },
            });
        }

        return await db.log.findMany({
            where: whereClause,
            skip: skip,
            take: take,
            include: {
                user: true,
                chemical: {
                    include: {
                        location: true,
                    },
                },
            },
        });
    }

    // If no pagination is specified, return all logs that match the whereClause
    if (Object.keys(whereClause).length === 0) {
        return await db.log.findMany({

            include: {
                user: true,
                chemical: {
                    include: {
                        location: true,
                    },
                },
            },
        });
    }

    return await db.log.findMany({
        where: whereClause,
        include: {
            user: true,
            chemical: {
                include: {
                    location: true,
                },
            },
        },
    });
};

export const addLog = async (params) => {
    const { userID, chemicalID, actionType, description } = params;
    return await db.log.create({
        data: {
            userID,
            actionType,
            chemicalID,
            description,
            timestamp: new Date(), // Assuming your Prisma schema uses a default now() for timestamp, this is optional
        },
    });
};

export const nullLog = async (chemicalID) => {
    return await db.log.updateMany({
        where: chemicalID,
        data: { chemicalID: null },
  });
};
// export const updateLog = async (params) => {
//     const { logID, description } = params;
//     return await db.log.update({
//         where: { logID },
//         data: {
//             description,
//             // You might not want to update other fields to preserve the integrity of the log
//         },
//     });
// };

// export const deleteLog = async (logID) => {
//     // Consider carefully if you want to allow deletion of logs
//     return await db.log.delete({
//         where: { logID },
//     });
// };
