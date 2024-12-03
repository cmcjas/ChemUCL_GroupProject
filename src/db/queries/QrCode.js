import { db } from 'db/index'

export const findQrCode = async (params) => {
    const { qrID, type, locationID, chemicalID } = params;
    let whereClause = {};

    if (qrID) whereClause.qrID = qrID;
    if (type) whereClause.type = type;
    if (locationID) whereClause.locationID = locationID;
    if (chemicalID) whereClause.chemicalID = chemicalID;

    if (Object.keys(whereClause).length === 0) {
        return await db.qrCode.findMany();
    }

    return await db.qrCode.findMany({
        where: whereClause,
    });
};

export const addQrCode = async (params) => {
    const { qrID, type, locationID, chemicalID } = params;

    const data = {
        type,
        locationID,
        chemicalID,
    };

    if(qrID !== undefined) data.qrID = qrID;

    return await db.qrCode.create({
        data,
    });
};

export const updateQrCode = async (params) => {
    const { qrID, type, locationID, chemicalID } = params;
    const paramData = {};

    if(type !== undefined) paramData.type = type;
    if(locationID !== undefined) paramData.location = { connect: { locationID: locationID } };
    if(chemicalID !== undefined) paramData.chemical = { connect: { chemicalID: chemicalID } };

    return await db.qrCode.update({
        where: { qrID },
        data: paramData,
    });
};

export const deleteQrCode = async (qrID) => {
    return await db.qrCode.delete({
        where: { qrID },
    });
};

export const lastQrCode = async () => {
    return await db.qrCode.findFirst({
        orderBy: {
            qrID: 'desc',
        },
    });
};

