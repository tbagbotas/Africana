CREATE TABLE "Donation" (
    "id" SERIAL NOT NULL,
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "paymentMethod" TEXT NOT NULL DEFAULT 'bank_transfer',
    "frequency" TEXT NOT NULL DEFAULT 'one-time',
    "transferReference" TEXT,
    "stripePaymentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Donation_donorEmail_idx" ON "Donation"("donorEmail");
CREATE INDEX "Donation_status_idx" ON "Donation"("status");
CREATE INDEX "Donation_createdAt_idx" ON "Donation"("createdAt");

CREATE TABLE "DonationSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "bankName" TEXT,
    "accountName" TEXT,
    "accountNumber" TEXT,
    "bankEnabled" BOOLEAN NOT NULL DEFAULT false,
    "stripeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "stripePaymentLink" TEXT,
    "paypalEnabled" BOOLEAN NOT NULL DEFAULT false,
    "paypalPaymentLink" TEXT,
    "gofundmeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "gofundmeLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DonationSettings_pkey" PRIMARY KEY ("id")
);
