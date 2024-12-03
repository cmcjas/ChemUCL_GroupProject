'use server';
import { db } from 'db/index'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export const findResearchGroup = async (params) => {
    const { researchGroupID, groupName } = params;
    let whereClause = {};

    if (researchGroupID) whereClause.researchGroupID = researchGroupID;
    if (groupName) whereClause.groupName = groupName;

    if (Object.keys(whereClause).length === 0) {
        return await db.researchGroup.findMany();
    }

    return await db.researchGroup.findMany({
        where: whereClause,
    });
};

export const addResearchGroup = async (params) => {
    const { groupName } = params;
    return await db.researchGroup.create({
        data: {
            groupName,
        },
    });
};

export const updateResearchGroup = async (params) => {
    const { researchGroupID, groupName } = params;
    const paramData = {};

    if(groupName) paramData.groupName = groupName;

    return await db.researchGroup.update({
        where: { researchGroupID },
        data: paramData,
    });
};

export const deleteResearchGroup = async (researchGroupID) => {
    return await db.researchGroup.delete({
        where: { researchGroupID },
    });
};
