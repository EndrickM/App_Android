-- AlterTable
ALTER TABLE "Lista" ADD COLUMN     "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Lista_lastAccessed_idx" ON "Lista"("lastAccessed");
