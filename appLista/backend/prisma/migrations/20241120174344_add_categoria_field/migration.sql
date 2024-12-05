/*
  Warnings:

  - Added the required column `categoria` to the `Lista` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoria` to the `subLista` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lista" ADD COLUMN     "categoria" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subLista" ADD COLUMN     "categoria" TEXT NOT NULL;
