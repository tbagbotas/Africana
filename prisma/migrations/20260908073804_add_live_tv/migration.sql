-- CreateTable
CREATE TABLE "LiveTV" (
    "id" SERIAL NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'YouTube Live',
    "status" TEXT NOT NULL DEFAULT 'OFFLINE',
    "streamTitle" TEXT NOT NULL DEFAULT 'Africana Live TV',
    "channelName" TEXT,
    "streamUrl" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveTV_pkey" PRIMARY KEY ("id")
);
