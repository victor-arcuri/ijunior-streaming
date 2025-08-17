import prisma from '../../../../config/prismaClient.js';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { TokenError } from '../../../../errors/TokenError.js';

const MusicaCreate = z.object({
    nome: z.string(),
    genero: z.string().optional(),
    album: z.string().optional(),
});

const MusicaUpdate = z
    .object({
        nome: z.string().optional(),
        genero: z.string().optional(),
        album: z.string().optional(),
    })
    .refine(
        (data) =>
            Object.values(data).some((val) => val !== undefined && val !== null && val !== ''),
        {
            message: 'Update de música inválido',
        },
    );

class ServiceMusica {
    // Cria nova música
    async criarMusica(body: Prisma.MusicaCreateInput) {
        const musica = MusicaCreate.parse(body);
        const musicaCriada = await prisma.musica.create({ data: musica });
        return musicaCriada;
    }

    // Deleta música com id especifico
    async deletarMusica(id: string) {
        await prisma.musica.delete({
            where: {
                id: id,
            },
        });
    }

    // Lista todas as músicas registradas
    async listarMusicas() {
        const musicas = await prisma.musica.findMany({
            orderBy: {
                id: 'asc',
            },
            include: {
                autoria: {
                    include: {
                        artista: true,
                    },
                },
            },
        });
        return musicas;
    }

    // Retoma a música com id especificado
    async listarMusicaID(id: string) {
        const musica = await prisma.musica.findUnique({
            where: {
                id: id,
            },
            include: {
                autoria: {
                    include: {
                        artista: true,
                    },
                },
            },
        });
        if (!musica) {
            throw new TokenError('UUID v4 inválido')
        }
        return musica;
    }

    // Atualiza informações da música de id especificado
    async atualizaMusica(id: string, body: Prisma.MusicaUpdateInput) {
        const musicaUpdate = MusicaUpdate.parse(body);
        const musica = await prisma.musica.update({
            where: {
                id: id,
            },
            data: musicaUpdate,
        });
        return musica;
    }

    // Vincula um artista à musica
    async vinculaMusicaArtista(artistaId: string, musicaId: string) {
        const autoria = await prisma.autoria.create({
            data: {
                artista: {
                    connect: {
                        id: artistaId,
                    },
                },
                musica: {
                    connect: {
                        id: musicaId,
                    },
                },
            },
        });
        return autoria;
    }

    // Desvincula um artista à musica
    async desvinculaMusicaArtista(where: Prisma.AutoriaWhereUniqueInput) {
        const autoria = await prisma.autoria.delete({
            where: where,
        });
        return autoria;
    }
}

export default new ServiceMusica();
