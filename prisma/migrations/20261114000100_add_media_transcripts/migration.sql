ALTER TABLE "Video"
ADD COLUMN "transcriptVtt" TEXT,
ADD COLUMN "transcriptApproved" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Podcast"
ADD COLUMN "transcriptVtt" TEXT,
ADD COLUMN "transcriptApproved" BOOLEAN NOT NULL DEFAULT false;
