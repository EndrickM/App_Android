-- AlterTable
ALTER TABLE "Lista" ADD COLUMN     "favorito" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Lista_categoria_idx" ON "Lista"("categoria");
