-- CreateTable
CREATE TABLE "LiveInterviewGuest" (
    "id" SERIAL NOT NULL,
    "interviewId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "location" TEXT,
    "inviteToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveInterviewGuest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LiveInterviewGuest_inviteToken_key" ON "LiveInterviewGuest"("inviteToken");

-- CreateIndex
CREATE INDEX "LiveInterviewGuest_interviewId_idx" ON "LiveInterviewGuest"("interviewId");

-- AddForeignKey
ALTER TABLE "LiveInterviewGuest" ADD CONSTRAINT "LiveInterviewGuest_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "LiveInterview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
