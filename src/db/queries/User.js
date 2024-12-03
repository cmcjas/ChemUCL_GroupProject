'use server';
import { db } from 'db/index'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const findUser = async (params, page = 0, rowsPerPage = 5) => {
    const { userID, email, name, activeStatus, researchGroupID, permission } = params;
    let whereClause = {};

    if (userID) whereClause.userID = userID;
    if (email) whereClause.email = email;
    if (name) whereClause.name = name;
    if (activeStatus !== undefined) whereClause.activeStatus = activeStatus;
    if (researchGroupID) whereClause.researchGroupID = researchGroupID;
    if (permission) whereClause.permission = permission;

    // Calculate skip and take for pagination
    const skip = page * rowsPerPage;
    const take = rowsPerPage;

    if (Object.keys(whereClause).length === 0) {
        return await db.user.findMany();
    }

    return await db.user.findMany({
        where: whereClause,
        skip: skip,
        take: take,
    });
};

export const addUser = async (params) => {
    const { email, name, activeStatus, researchGroupID, permission } = params;
    return await db.user.create({
        data: {
            email,
            name,
            activeStatus,
            researchGroupID,
            permission,
        },
    });
};

export const updateUser = async (params) => {
    const { userID, email, name, activeStatus, researchGroupID, permission } = params;
    const paramData = {};

    if(email) paramData.email = email;
    if(name) paramData.name = name;
    if(activeStatus !== undefined) paramData.activeStatus = activeStatus;
    if(researchGroupID !== undefined) paramData.researchGroupID = researchGroupID;
    if(permission) paramData.permission = permission;

    const updateUser = await db.user.update({
        where: { userID },
        data: paramData,
    });
    revalidatePath('/manage-user-page');
    redirect('/manage-user-page');
    
};

 
export const deleteUser = async (userID) => {

    try {
        // Step 1: Set the researchGroupID to null for the user
        await prisma.user.update({
          where: {
            userID: userID,
          },
          data: {
            researchGroupID: null,
          },
        });
    }
    catch (error) {
        console.error("Error nullify user group ID:", error);
    }

    const delUser = await db.user.delete({
        where:  userID ,
    });
    revalidatePath('/manage-user-page');
    redirect('/manage-user-page');
};
