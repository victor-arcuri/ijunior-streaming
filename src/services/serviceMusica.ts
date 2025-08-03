import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const criarMusica = async (
  nome: string,
  genero?: string,
  album?: string
) => {
  return await prisma.musica.create({
    data: { nome, genero, album }
  });
};

// Vincula um artista à musica
export const vincularArtista = async (
  musicaId: string,
  artistaId: string
) => {
  return await prisma.autoria.create({
    data: { musicaId, artistaId }
  });
};

// Lista todas as músicas com seus artistas
export const listarMusicas = async () => {
  return await prisma.musica.findMany({
    include: {
      autoria: {
        include: {
          artista: true
        }
      }
    }
  });
};

// Busca música por ID com relacionamentos
export const buscarMusicaPorId = async (id: string) => {
  return await prisma.musica.findUnique({
    where: { id },
    include: {
      autoria: {
        include: {
          artista: true
        }
      }
    }
  });
};

export const atualizarMusica = async (
  id: string,
  dados: { nome?: string; genero?: string; album?: string }
) => {
  return await prisma.musica.update({
    where: { id },
    data: dados
  });
};

// Remove uma música (cascateia para Autoria, LogMusica e MusicaSalva)
export const deletarMusica = async (id: string) => {
  return await prisma.musica.delete({
    where: { id }
  });
};

// Lista músicas de um artista específico
export const listarMusicasDoArtista = async (artistaId: string) => {
  return await prisma.autoria.findMany({
    where: { artistaId },
    include: {
      musica: true,
      artista: true
    }
  });
};
