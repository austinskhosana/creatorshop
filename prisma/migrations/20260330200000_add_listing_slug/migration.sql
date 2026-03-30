-- AlterTable
ALTER TABLE "software_listings" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';

-- Backfill: set slug = id for any existing rows
UPDATE "software_listings" SET "slug" = "id";

-- AlterColumn: remove the default now that rows are populated
ALTER TABLE "software_listings" ALTER COLUMN "slug" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "software_listings_slug_key" ON "software_listings"("slug");
