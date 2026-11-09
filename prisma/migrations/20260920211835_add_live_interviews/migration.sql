-- CreateTable
CREATE TABLE "LiveInterview" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT,
    "guestLocation" TEXT,
    "interviewDate" TIMESTAMP(3),
    "roomName" TEXT NOT NULL,
    "inviteToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveInterview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LiveInterview_roomName_key" ON "LiveInterview"("roomName");

-- CreateIndex
CREATE UNIQUE INDEX "LiveInterview_inviteToken_key" ON "LiveInterview"("inviteToken");
