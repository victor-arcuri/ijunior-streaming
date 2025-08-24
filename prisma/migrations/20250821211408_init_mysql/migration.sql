-- CreateTable
CREATE TABLE `Usuario` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `privilegio` ENUM('PADRAO', 'ADMIN') NOT NULL DEFAULT 'PADRAO',
    `senha` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Artista` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `streams` INTEGER NOT NULL DEFAULT 0,
    `foto` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Musica` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `genero` VARCHAR(191) NULL,
    `album` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Autoria` (
    `artistaId` VARCHAR(191) NOT NULL,
    `musicaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`artistaId`, `musicaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogMusica` (
    `id` VARCHAR(191) NOT NULL,
    `tempo` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` VARCHAR(191) NULL,
    `musicaId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MusicaSalva` (
    `usuarioId` VARCHAR(191) NOT NULL,
    `musicaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`usuarioId`, `musicaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Autoria` ADD CONSTRAINT `Autoria_artistaId_fkey` FOREIGN KEY (`artistaId`) REFERENCES `Artista`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Autoria` ADD CONSTRAINT `Autoria_musicaId_fkey` FOREIGN KEY (`musicaId`) REFERENCES `Musica`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogMusica` ADD CONSTRAINT `LogMusica_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogMusica` ADD CONSTRAINT `LogMusica_musicaId_fkey` FOREIGN KEY (`musicaId`) REFERENCES `Musica`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MusicaSalva` ADD CONSTRAINT `MusicaSalva_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MusicaSalva` ADD CONSTRAINT `MusicaSalva_musicaId_fkey` FOREIGN KEY (`musicaId`) REFERENCES `Musica`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
