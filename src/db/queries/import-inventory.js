// import {db} from 'db'

// // export async function importInventory(chemicalData, locationData) {
// //     try{
// //         const chemicalResult = await db.Chemical.create({
// //             data: chemicalData,
// //         });

// //         const locationResult = await db.Location.create({
// //             data: locationData,
// //         });

// //         return {chemicalResult, locationResult};
// //       } catch (error) {
// //         console.error('Error inserting data into the database:', error);
// //         throw new Error('An error occurred while inserting data into the database');
// //     }   
// // }

// export async function importInventory(chemicalDataArray, locationData) {
//     try {
//       const results = [];
  
//       // Iterate over each chemical data object in the array
//       for (const chemicalData of chemicalDataArray) {
//         const chemicalResult = await db.Chemical.create({
//           data: chemicalData,
//         });
  
//         results.push(chemicalResult); // Store the result for each chemical in the results array
//       }
  
//       // Create location data after all chemicals are created
//       const locationResult = await db.Location.create({
//         data: locationData,
//       });
  
//       results.push(locationResult); // Add location result to the results array
  
//       return results; // Return the array of results
//     } catch (error) {
//       console.error('Error inserting data into the database:', error);
//       throw new Error('An error occurred while inserting data into the database');
//     }
//   }

// import { db } from 'db';

// export async function importInventory(chemicalDataArray, locationDataArray) {
//     try {
//         const results = [];

//         // Iterate over each chemical data object in the array
//         for (const [index, chemicalData] of chemicalDataArray.entries()) {
//             let researchGroup = await db.ResearchGroup.findUnique({ where: { groupName: chemicalData.researchGroup } });
//             if (!researchGroup) {
//                 researchGroup = await db.ResearchGroup.create({ data: { groupName: chemicalData.researchGroup } });
//             }
            
//             const locationData = locationDataArray[index];
//             let location = await db.Location.findUnique({ where: { building: locationData.building, room: locationData.room } });
//             if (!location) {
//                 location = await db.Location.create({ data: locationData });
//             }
            
//             chemicalData.researchGroupID = researchGroup.groupId;
//             chemicalData.locationID = location.locationID;

//             const chemicalResult = await db.Chemical.create({
//                 data: chemicalData,
//         });

//             results.push({ chemicalResult, locationResult:location }); 
//         }

//         return results; // Return the array of results
//     } catch (error) {
//         console.error('Error inserting data into the database:', error);
//         throw new Error('An error occurred while inserting data into the database');
//     }
// }

// 'use server';
// import { db } from "db/index";

// export async function importInventory(chemicalDataArray, locationDataArray) {
//     try {
//         const results = [];

//         // Iterate over each chemical data object in the array
//         for (const [index, chemicalData] of chemicalDataArray.entries()) {
//             let researchGroup = await db.ResearchGroup.findUnique({ where: { groupName: chemicalData.researchGroup } });
//             if (!researchGroup) {
//                 researchGroup = await db.ResearchGroup.create({ data: { groupName: chemicalData.researchGroup } });
//             }
            
//             const locationData = locationDataArray[index];
//             let location = await db.Location.findUnique({ where: { building: locationData.building, room: locationData.room } });
//             if (!location) {
//                 location = await db.Location.create({ data: locationData });
//             }
            
//             chemicalData.researchGroupID = researchGroup.groupId;
//             chemicalData.locationID = location.locationID;

//             const chemicalResult = await db.Chemical.create({
//                 data: {
//                     casNumber: chemicalData.casNumber,
//                     restrictionStatus: chemicalData.restrictionStatus,
//                     chemicalName: chemicalData.chemicalName,
//                     locationID: chemicalData.locationID,
//                     activeStatus: chemicalData.activeStatus,
//                     researchGroupID: chemicalData.researchGroupID, 
//                     supplier: chemicalData.supplier,
//                     description: chemicalData.description,
//                     auditStatus: chemicalData.auditStatus,
//                     lastAudit: chemicalData.lastAudit,
//                     quartzyNumber: chemicalData.quartzyNumber,
//                     qrID: chemicalData.qrID,
//                     qrCode: chemicalData.qrCode,
//                     quantity: chemicalData.quantity,
//                 },
//             });

//             results.push({ chemicalResult, locationResult: location }); 
//         }

//         return results; // Return the array of results
//     } catch (error) {
//         console.error('Error inserting data into the database:', error);
//         throw new Error('An error occurred while inserting data into the database');
//     }
// }

// import express from 'express';
// import { db } from 'db/index';

// const app = express();

// app.use(express.json());

// app.post('/db/queries/import-inventory', async (req, res) => {
//     const { chemicalDataArray, locationDataArray } = req.body;

//     try {
//         const results = [];

//         // Iterate over each chemical data object in the array
//         for (const [index, chemicalData] of chemicalDataArray.entries()) {
//             let researchGroup = await db.ResearchGroup.findUnique({ where: { groupName: chemicalData.researchGroup } });
//             if (!researchGroup) {
//                 researchGroup = await db.ResearchGroup.create({ data: { groupName: chemicalData.researchGroup } });
//             }

//             const locationData = locationDataArray[index];
//             let location = await db.Location.findUnique({ where: { building: locationData.building, room: locationData.room } });
//             if (!location) {
//                 location = await db.Location.create({ data: locationData });
//             }

//             chemicalData.researchGroupID = researchGroup.groupId;
//             chemicalData.locationID = location.locationID;

//             const chemicalResult = await db.Chemical.create({
//                 data: {
//                     casNumber: chemicalData.casNumber,
//                     restrictionStatus: chemicalData.restrictionStatus,
//                     chemicalName: chemicalData.chemicalName,
//                     locationID: chemicalData.locationID,
//                     activeStatus: chemicalData.activeStatus,
//                     researchGroupID: chemicalData.researchGroupID,
//                     supplier: chemicalData.supplier,
//                     description: chemicalData.description,
//                     auditStatus: chemicalData.auditStatus,
//                     lastAudit: chemicalData.lastAudit,
//                     quartzyNumber: chemicalData.quartzyNumber,
//                     qrID: chemicalData.qrID,
//                     qrCode: chemicalData.qrCode,
//                     quantity: chemicalData.quantity,
//                 },
//             });

//             results.push({ chemicalResult, locationResult: location });
//         }

//         res.json(results);
//     } catch (error) {
//         console.error('Error inserting data into the database:', error);
//         res.status(500).json({ error: 'An error occurred while inserting data into the database' });
//     }
// });

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });

import { db } from 'db/index';

export async function importInventory(chemicalDataArray, locationDataArray) {
    try {
        const results = [];

        // Iterate over each chemical data object in the array
        for (const [index, chemicalData] of chemicalDataArray.entries()) {
            let researchGroup = await db.ResearchGroup.findUnique({ where: { groupName: chemicalData.researchGroup } });
            if (!researchGroup) {
                researchGroup = await db.ResearchGroup.create({ data: { groupName: chemicalData.researchGroup } });
            }

            const locationData = locationDataArray[index];
            let location = await db.Location.findUnique({ where: { building: locationData.building, room: locationData.room } });
            if (!location) {
                location = await db.Location.create({ data: locationData });
            }

            chemicalData.researchGroupID = researchGroup.groupId;
            chemicalData.locationID = location.locationID;

            const chemicalResult = await db.Chemical.create({
                data: {
                    casNumber: chemicalData.casNumber,
                    restrictionStatus: chemicalData.restrictionStatus,
                    chemicalName: chemicalData.chemicalName,
                    locationID: chemicalData.locationID,
                    activeStatus: chemicalData.activeStatus,
                    researchGroupID: chemicalData.researchGroupID,
                    supplier: chemicalData.supplier,
                    description: chemicalData.description,
                    auditStatus: chemicalData.auditStatus,
                    lastAudit: chemicalData.lastAudit,
                    quartzyNumber: chemicalData.quartzyNumber,
                    qrID: chemicalData.qrID,
                    qrCode: chemicalData.qrCode,
                    quantity: chemicalData.quantity,
                },
            });

            results.push({ chemicalResult, locationResult: location });
        }

        return results;
    } catch (error) {
        console.error('Error inserting data into the database:', error);
        throw new Error('An error occurred while inserting data into the database');
    }
}

