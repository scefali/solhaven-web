-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "supabaseUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_supabaseUserId_key" ON "Profile"("supabaseUserId");
