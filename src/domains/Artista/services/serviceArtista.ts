import prisma from '../../../../config/prismaClient.js';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { TokenError } from '../../../../errors/TokenError.js';

const ArtistaCreate = z.object({
    nome: z.string(),
    streams: z.number().optional(),
    foto: z.string().optional(),
});

const ArtistaUpdate = z
    .object({
        nome: z.string(),
        streams: z.number().optional(),
        foto: z.string().optional(),
    })
    .refine(
        (data) =>
            Object.values(data).some((val) => val !== undefined && val !== null && val !== ''),
        {
            message: 'Update de artista inválido',
        },
    );

class ServiceArtista {
    // Cria novo artista
    async criarArtista(body: Prisma.ArtistaCreateInput) {
        const artista = ArtistaCreate.parse(body);
        const artistaCriado = await prisma.artista.create({ data: artista });
        return artistaCriado;
    }

    // Deleta artista com id especifico
    async deletarArtista(id: string) {
        await prisma.artista.delete({
            where: {
                id: id,
            },
        });
    }

    // Lista todos os artistas registrados
    async listarArtistas() {
        const artistas = await prisma.artista.findMany({
            orderBy: {
                id: 'asc',
            },
        });
        return artistas;
    }

    // Retorna o artista com id especificado
    async listarArtistaID(id: string) {
        const artista = await prisma.artista.findUnique({
            where: {
                id: id,
            },
        });
        if (!artista) {
            throw new TokenError('UUID v4 inválido');
        }
        return artista;
    }

    // Atualiza informações do artista de id especificado
    async atualizaArtista(id: string, body: Prisma.ArtistaUpdateInput) {
        const artistaUpdate = ArtistaUpdate.parse(body);
        const artista = await prisma.artista.update({
            where: {
                id: id,
            },
            data: artistaUpdate,
        });
        return artista;
    }

    // Lista músicas do artista
    async listaMusicasArtista(id: string) {
        const musicas = await prisma.autoria.findMany({
            where: {
                artistaId: id,
            },
            select: {
                musica: {
                    select: {
                        id: true,
                        nome: true,
                        genero: true,
                        album: true,
                    },
                },
            },
        });
        return musicas;
    }
}

export default new ServiceArtista();
