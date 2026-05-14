-- Extend existing status enum for landing page/webhook approval flow.
ALTER TYPE "PartnerStatus" ADD VALUE IF NOT EXISTS 'PENDING_APPROVAL';

-- New option enums.
CREATE TYPE "AttendanceMode" AS ENUM ('IN_PERSON', 'IN_PERSON_ONLINE', 'ONLINE');
CREATE TYPE "MonthlyAppointmentsRange" AS ENUM ('UP_TO_30', 'UP_TO_50', 'ABOVE_50');
CREATE TYPE "ServiceDaysRange" AS ENUM ('TWO_DAYS', 'THREE_DAYS', 'MORE');
CREATE TYPE "VisitPreference" AS ENUM ('IN_PERSON', 'REMOTE');
CREATE TYPE "StockLocation" AS ENUM ('CD', 'OFFICE', 'STORE');

-- Partner commercial/profile fields.
ALTER TABLE "Partner"
  ADD COLUMN "monthlyAppointmentsRange" "MonthlyAppointmentsRange",
  ADD COLUMN "attendanceMode" "AttendanceMode",
  ADD COLUMN "serviceDays" "ServiceDaysRange",
  ADD COLUMN "serviceHours" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "visitPreference" "VisitPreference";

-- Event invited/attendance control.
ALTER TABLE "EventParticipant" ADD COLUMN "attended" BOOLEAN NOT NULL DEFAULT false;

-- Visit completion control.
ALTER TABLE "Visit" ADD COLUMN "completed" BOOLEAN NOT NULL DEFAULT false;

-- Gift/product stock control.
CREATE TABLE "Product" (
  "id" TEXT NOT NULL,
  "sku" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "ean" TEXT,
  "value" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "stockLocation" "StockLocation" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE INDEX "Product_name_idx" ON "Product"("name");
CREATE INDEX "Product_stockLocation_idx" ON "Product"("stockLocation");

-- Award kit composition.
CREATE TABLE "_AwardCatalogToProduct" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  CONSTRAINT "_AwardCatalogToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE INDEX "_AwardCatalogToProduct_B_index" ON "_AwardCatalogToProduct"("B");

ALTER TABLE "_AwardCatalogToProduct"
  ADD CONSTRAINT "_AwardCatalogToProduct_A_fkey"
  FOREIGN KEY ("A") REFERENCES "AwardCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_AwardCatalogToProduct"
  ADD CONSTRAINT "_AwardCatalogToProduct_B_fkey"
  FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
