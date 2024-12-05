/*
  Warnings:

  - You are about to drop the column `categoria` on the `subLista` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Lista` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lista" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "senha" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subLista" DROP COLUMN "categoria";

-- AddForeignKey
ALTER TABLE "Lista" ADD CONSTRAINT "Lista_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
