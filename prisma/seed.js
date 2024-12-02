const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {

  // Create a ResearchGroup
  const researchGroup = await prisma.researchGroup.create({
    data: {
      groupName: 'Genetic Engineering Lab',
    },
  });

  // Create a User and directly assign to ResearchGroup with the randomly selected ID
  let lastUser;

  const usersData = [
    { email: 'researcher@lab.example', name: 'Dr. Alice', permission: 'Research Student' },
    { email: 'uccakpa@ucl.ac.uk', name: 'Kristopher', permission: 'Staff' },
    { email: 'ucca245@ucl.ac.uk', name: 'Andrea', permission: 'Staff' },
    { email: 'ucabelf@ucl.ac.uk', name: 'Aurora', permission: 'Admin' },
    { email: 'ucqsmto@ucl.ac.uk', name: 'Martyn', permission: 'Admin' },
  ];

  for (const userData of usersData) {
    let user = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          ...userData,
          activeStatus: true,
          researchGroupID: researchGroup.researchGroupID,
        },
      });
    }
    lastUser = user;
  }

  // Create a Location
const location = await prisma.location.create({
  data: {
    building: 'B2',
    room: '101',
    subLocation1: 'Shelf 1',
  },
});

  // Create a QrCode for the location
  const qrCodeLocation = await prisma.qrCode.create({
    data: {
      type: 'LOCATION',
      locationID: location.locationID,
    },
  });

 // Create a Chemical including the quantity field
const chemical = await prisma.chemical.create({
  data: {
    casNumber: '7732-18-5',
    chemicalName: 'Water',
    restrictionStatus: false,
    locationID: location.locationID,
    activeStatus: true,
    researchGroupID: researchGroup.researchGroupID,
    supplier: 'ChemSupply Co.',
    description: 'purified',
    chemicalType: 'Chemical',
    auditStatus: true,
    lastAudit: new Date(),
    quartzyNumber: 'WTR-001',
    qrID: qrCodeLocation.qrID,
    quantity: 100,
  },
});

  // Create a QrCode for the chemical
  await prisma.qrCode.create({
    data: {
      type: 'CHEMICAL',
      chemicalID: chemical.chemicalID,
    },
  });

  // Create a Log entry
  if (lastUser) {
    await prisma.log.create({
      data: {
        userID: lastUser.userID,
        actionType: 'Added',
        chemicalID: chemical.chemicalID,
        description: 'Chemical Water, purified added to inventory',
        timestamp: new Date(),
      },
    });
  }

  console.log('Database has been seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });