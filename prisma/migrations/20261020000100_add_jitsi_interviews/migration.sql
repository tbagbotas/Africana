-- CreateTable
CREATE TABLE "JitsiInterview" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JitsiInterview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JitsiInterviewGuest" (
    "id" SERIAL NOT NULL,
    "interviewId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "inviteToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JitsiInterviewGuest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JitsiInterview_roomName_key" ON "JitsiInterview"("roomName");

-- CreateIndex
CREATE INDEX "JitsiInterview_status_idx" ON "JitsiInterview"("status");

-- CreateIndex
CREATE INDEX "JitsiInterview_createdAt_idx" ON "JitsiInterview"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "JitsiInterviewGuest_inviteToken_key" ON "JitsiInterviewGuest"("inviteToken");

-- CreateIndex
CREATE INDEX "JitsiInterviewGuest_interviewId_idx" ON "JitsiInterviewGuest"("interviewId");

-- AddForeignKey
ALTER TABLE "JitsiInterviewGuest" ADD CONSTRAINT "JitsiInterviewGuest_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "JitsiInterview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
