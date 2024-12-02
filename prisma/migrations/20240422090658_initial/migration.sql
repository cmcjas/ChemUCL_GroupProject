-- CreateEnum
CREATE TYPE "QrCodeType" AS ENUM ('CHEMICAL', 'LOCATION', 'NEW');

-- CreateTable
CREATE TABLE "User" (
    "userID" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "activeStatus" BOOLEAN NOT NULL DEFAULT true,
    "researchGroupID" INTEGER,
    "permission" TEXT NOT NULL DEFAULT 'Research Student',

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "chemicals" (
    "chemicalID" SERIAL NOT NULL,
    "casNumber" TEXT,
    "restrictionStatus" BOOLEAN NOT NULL,
    "restrictionDescription" TEXT,
    "chemicalName" TEXT NOT NULL,
    "locationID" INTEGER NOT NULL,
    "activeStatus" BOOLEAN NOT NULL DEFAULT true,
    "researchGroupID" INTEGER,
    "supplier" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "chemicalType" TEXT NOT NULL DEFAULT 'Chemical',
    "auditStatus" BOOLEAN NOT NULL DEFAULT false,
    "lastAudit" TIMESTAMP(3),
    "quartzyNumber" TEXT,
    "qrID" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chemicals_pkey" PRIMARY KEY ("chemicalID")
);

-- CreateTable
CREATE TABLE "ResearchGroup" (
    "researchGroupID" SERIAL NOT NULL,
    "groupName" TEXT NOT NULL,

    CONSTRAINT "ResearchGroup_pkey" PRIMARY KEY ("researchGroupID")
);

-- CreateTable
CREATE TABLE "QrCode" (
    "qrID" SERIAL NOT NULL,
    "type" "QrCodeType" NOT NULL,
    "locationID" INTEGER,
    "chemicalID" INTEGER,

    CONSTRAINT "QrCode_pkey" PRIMARY KEY ("qrID")
);

-- CreateTable
CREATE TABLE "locations" (
    "locationID" SERIAL NOT NULL,
    "building" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "subLocation1" TEXT,
    "subLocation2" TEXT,
    "subLocation3" TEXT,
    "subLocation4" TEXT,
    "qrID" INTEGER,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("locationID")
);

-- CreateTable
CREATE TABLE "logs" (
    "logID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "actionType" TEXT NOT NULL,
    "chemicalID" INTEGER,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("logID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "chemicals_qrID_key" ON "chemicals"("qrID");

-- CreateIndex
CREATE UNIQUE INDEX "QrCode_locationID_key" ON "QrCode"("locationID");

-- CreateIndex
CREATE UNIQUE INDEX "QrCode_chemicalID_key" ON "QrCode"("chemicalID");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_researchGroupID_fkey" FOREIGN KEY ("researchGroupID") REFERENCES "ResearchGroup"("researchGroupID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chemicals" ADD CONSTRAINT "chemicals_locationID_fkey" FOREIGN KEY ("locationID") REFERENCES "locations"("locationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chemicals" ADD CONSTRAINT "chemicals_researchGroupID_fkey" FOREIGN KEY ("researchGroupID") REFERENCES "ResearchGroup"("researchGroupID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrCode" ADD CONSTRAINT "QrCode_locationID_fkey" FOREIGN KEY ("locationID") REFERENCES "locations"("locationID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrCode" ADD CONSTRAINT "QrCode_chemicalID_fkey" FOREIGN KEY ("chemicalID") REFERENCES "chemicals"("chemicalID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_chemicalID_fkey" FOREIGN KEY ("chemicalID") REFERENCES "chemicals"("chemicalID") ON DELETE SET NULL ON UPDATE CASCADE;
