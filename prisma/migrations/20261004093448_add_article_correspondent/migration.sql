-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "correspondentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_correspondentId_fkey" FOREIGN KEY ("correspondentId") REFERENCES "Correspondent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
