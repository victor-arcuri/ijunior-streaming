-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "privilegio" TEXT NOT NULL DEFAULT 'PADRAO',
    "senha" TEXT NOT NULL,
    "foto" TEXT
);

-- CreateTable
CREATE TABLE "Artista" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "streams" INTEGER,
    "foto" TEXT
);

-- CreateTable
CREATE TABLE "Musica" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "genero" TEXT,
    "album" TEXT
);

-- CreateTable
CREATE TABLE "Autoria" (
    "artistaId" TEXT NOT NULL,
    "musicaId" TEXT NOT NULL,

    PRIMARY KEY ("artistaId", "musicaId"),
    CONSTRAINT "Autoria_artistaId_fkey" FOREIGN KEY ("artistaId") REFERENCES "Artista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Autoria_musicaId_fkey" FOREIGN KEY ("musicaId") REFERENCES "Musica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LogMusica" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    "musicaId" TEXT NOT NULL,
    CONSTRAINT "LogMusica_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LogMusica_musicaId_fkey" FOREIGN KEY ("musicaId") REFERENCES "Musica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MusicaSalva" (
    "usuarioId" TEXT NOT NULL,
    "musicaId" TEXT NOT NULL,

    PRIMARY KEY ("usuarioId", "musicaId"),
    CONSTRAINT "MusicaSalva_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MusicaSalva_musicaId_fkey" FOREIGN KEY ("musicaId") REFERENCES "Musica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
