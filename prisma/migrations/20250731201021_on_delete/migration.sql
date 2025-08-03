/*
  Warnings:

  - You are about to drop the column `time` on the `LogMusica` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artista" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "streams" INTEGER NOT NULL DEFAULT 0,
    "foto" TEXT
);
INSERT INTO "new_Artista" ("foto", "id", "nome", "streams") SELECT "foto", "id", "nome", coalesce("streams", 0) AS "streams" FROM "Artista";
DROP TABLE "Artista";
ALTER TABLE "new_Artista" RENAME TO "Artista";
CREATE TABLE "new_Autoria" (
    "artistaId" TEXT NOT NULL,
    "musicaId" TEXT NOT NULL,

    PRIMARY KEY ("artistaId", "musicaId"),
    CONSTRAINT "Autoria_artistaId_fkey" FOREIGN KEY ("artistaId") REFERENCES "Artista" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Autoria_musicaId_fkey" FOREIGN KEY ("musicaId") REFERENCES "Musica" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Autoria" ("artistaId", "musicaId") SELECT "artistaId", "musicaId" FROM "Autoria";
DROP TABLE "Autoria";
ALTER TABLE "new_Autoria" RENAME TO "Autoria";
CREATE TABLE "new_LogMusica" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tempo" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT,
    "musicaId" TEXT,
    CONSTRAINT "LogMusica_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LogMusica_musicaId_fkey" FOREIGN KEY ("musicaId") REFERENCES "Musica" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_LogMusica" ("id", "musicaId", "usuarioId") SELECT "id", "musicaId", "usuarioId" FROM "LogMusica";
DROP TABLE "LogMusica";
ALTER TABLE "new_LogMusica" RENAME TO "LogMusica";
CREATE TABLE "new_MusicaSalva" (
    "usuarioId" TEXT NOT NULL,
    "musicaId" TEXT NOT NULL,

    PRIMARY KEY ("usuarioId", "musicaId"),
    CONSTRAINT "MusicaSalva_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MusicaSalva_musicaId_fkey" FOREIGN KEY ("musicaId") REFERENCES "Musica" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MusicaSalva" ("musicaId", "usuarioId") SELECT "musicaId", "usuarioId" FROM "MusicaSalva";
DROP TABLE "MusicaSalva";
ALTER TABLE "new_MusicaSalva" RENAME TO "MusicaSalva";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
