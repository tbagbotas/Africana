-- CreateTable
CREATE TABLE "Correspondent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "photo" TEXT,
    "country" TEXT,
    "city" TEXT,
    "bio" TEXT,
    "specialization" TEXT,
    "email" TEXT,
    "website" TEXT,
    "socialLinks" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Correspondent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Correspondent_slug_key" ON "Correspondent"("slug");
