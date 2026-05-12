-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PartnerKind" AS ENUM ('PERSON', 'COMPANY');

-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ServiceValueKind" AS ENUM ('CONSULTATION', 'CLASS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "kind" "PartnerKind" NOT NULL DEFAULT 'PERSON',
    "firstName" TEXT,
    "lastName" TEXT,
    "fullName" TEXT NOT NULL,
    "companyName" TEXT,
    "cpf" TEXT,
    "cnpj" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "birthDate" TIMESTAMP(3),
    "coupon" TEXT,
    "partnershipStart" TIMESTAMP(3),
    "instagram" TEXT,
    "facebook" TEXT,
    "tiktok" TEXT,
    "address" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "zipCode" TEXT,
    "district" TEXT,
    "city" TEXT,
    "state" TEXT,
    "monthlyAppointments" INTEGER,
    "prescriptionPoints" INTEGER NOT NULL DEFAULT 0,
    "status" "PartnerStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "photoKey" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "professionId" TEXT,
    "categoryId" TEXT,
    "consultationValueId" TEXT,
    "classValueId" TEXT,
    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PartnerType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profession" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Profession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceValue" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "kind" "ServiceValueKind" NOT NULL,
    "professionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationshipTeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RelationshipTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "investment" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalParticipants" INTEGER NOT NULL DEFAULT 0,
    "prizes" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventTypeId" TEXT NOT NULL,
    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventParticipant" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL,
    "giftReceived" BOOLEAN NOT NULL DEFAULT false,
    "giftDescription" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AwardCatalog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AwardCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerAward" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "awardCatalogId" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PartnerAward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PartnerToPartnerType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PartnerToPartnerType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RelationshipTeamMemberToVisit" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RelationshipTeamMemberToVisit_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_cpf_key" ON "Partner"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_cnpj_key" ON "Partner"("cnpj");

-- CreateIndex
CREATE INDEX "Partner_fullName_idx" ON "Partner"("fullName");

-- CreateIndex
CREATE INDEX "Partner_status_idx" ON "Partner"("status");

-- CreateIndex
CREATE INDEX "Partner_professionId_idx" ON "Partner"("professionId");

-- CreateIndex
CREATE INDEX "Partner_categoryId_idx" ON "Partner"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerType_name_key" ON "PartnerType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Profession_name_key" ON "Profession"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceValue_label_kind_professionId_key" ON "ServiceValue"("label", "kind", "professionId");

-- CreateIndex
CREATE UNIQUE INDEX "RelationshipTeamMember_name_key" ON "RelationshipTeamMember"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EventType_name_key" ON "EventType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EventParticipant_eventId_partnerId_key" ON "EventParticipant"("eventId", "partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "AwardCatalog_name_key" ON "AwardCatalog"("name");

-- CreateIndex
CREATE INDEX "_PartnerToPartnerType_B_index" ON "_PartnerToPartnerType"("B");

-- CreateIndex
CREATE INDEX "_RelationshipTeamMemberToVisit_B_index" ON "_RelationshipTeamMemberToVisit"("B");

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_consultationValueId_fkey" FOREIGN KEY ("consultationValueId") REFERENCES "ServiceValue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_classValueId_fkey" FOREIGN KEY ("classValueId") REFERENCES "ServiceValue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceValue" ADD CONSTRAINT "ServiceValue_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerAward" ADD CONSTRAINT "PartnerAward_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerAward" ADD CONSTRAINT "PartnerAward_awardCatalogId_fkey" FOREIGN KEY ("awardCatalogId") REFERENCES "AwardCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartnerToPartnerType" ADD CONSTRAINT "_PartnerToPartnerType_A_fkey" FOREIGN KEY ("A") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartnerToPartnerType" ADD CONSTRAINT "_PartnerToPartnerType_B_fkey" FOREIGN KEY ("B") REFERENCES "PartnerType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelationshipTeamMemberToVisit" ADD CONSTRAINT "_RelationshipTeamMemberToVisit_A_fkey" FOREIGN KEY ("A") REFERENCES "RelationshipTeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelationshipTeamMemberToVisit" ADD CONSTRAINT "_RelationshipTeamMemberToVisit_B_fkey" FOREIGN KEY ("B") REFERENCES "Visit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
