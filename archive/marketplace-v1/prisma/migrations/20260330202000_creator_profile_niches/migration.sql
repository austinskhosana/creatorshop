-- Rename niche (String?) to niches (String[])
ALTER TABLE "creator_profiles" RENAME COLUMN "niche" TO "niches";
ALTER TABLE "creator_profiles" ALTER COLUMN "niches" TYPE TEXT[] USING CASE WHEN "niches" IS NULL THEN '{}'::TEXT[] ELSE ARRAY["niches"] END;
ALTER TABLE "creator_profiles" ALTER COLUMN "niches" SET NOT NULL;
ALTER TABLE "creator_profiles" ALTER COLUMN "niches" SET DEFAULT '{}';
