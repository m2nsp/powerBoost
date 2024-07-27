-- CreateTable
CREATE TABLE `Scraps` (
    `id` VARCHAR(191) NOT NULL,
    `scrapperId` VARCHAR(191) NOT NULL,
    `scrapPostId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Scraps_scrapperId_scrapPostId_key`(`scrapperId`, `scrapPostId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Scraps` ADD CONSTRAINT `Scraps_scrapperId_fkey` FOREIGN KEY (`scrapperId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scraps` ADD CONSTRAINT `Scraps_scrapPostId_fkey` FOREIGN KEY (`scrapPostId`) REFERENCES `Posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
