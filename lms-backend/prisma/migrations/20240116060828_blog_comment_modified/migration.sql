/*
  Warnings:

  - You are about to drop the column `email` on the `BlogComment` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `BlogComment` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `BlogComment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `BlogComment` DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `website`,
    ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `BlogComment` ADD CONSTRAINT `BlogComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
