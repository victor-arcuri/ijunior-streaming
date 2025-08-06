import prisma from '../../../../config/prismaClient.js';
import { Prisma } from '@prisma/client';

class ServiceArtista {
    // Cria novo artista
    async criarArtista(body: Prisma.ArtistaCreateInput) {
        const artista: Prisma.ArtistaCreateInput = {
            nome: body.nome,
            foto: body.foto,
            streams: body.streams,
        };

        try {
            const artistaCriado = await prisma.artista.create({ data: artista });
            return artistaCriado;
        } catch (erro) {
            throw new Error(`Erro ao criar artista: ${erro}`);
        }
    }

    // Deleta artista com id especifico
    async deletarArtista(id: string) {
        try {
            await prisma.artista.delete({
                where: {
                    id: id,
                },
            });
        } catch (erro) {
            throw new Error(`Erro ao deletar artista: ${erro}`);
        }
    }

    // Lista todos os artistas registrados
    async listarArtistas() {
        try {
            const artistas = await prisma.artista.findMany({
                orderBy: {
                    id: 'asc',
                },
            });
            return artistas;
        } catch (erro) {
            throw new Error(`Erro ao listar artistas: ${erro}`);
        }
    }

    // Retorna o artista com id especificado
    async listarArtistaID(id: string) {
        try {
            const artista = await prisma.artista.findUnique({
                where: {
                    id: id,
                },
            });
            return artista;
        } catch (erro) {
            throw new Error(`Erro ao retornar artista de id ${id}: ${erro}`);
        }
    }

    // Atualiza informações do artista de id especificado
    async atualizaArtista(id: string, body: Prisma.ArtistaUpdateInput) {
        try {
            const artista = await prisma.artista.update({
                where: {
                    id: id,
                },
                data: body,
            });
            return artista;
        } catch (erro) {
            throw new Error(`Erro ao atualizar artista de id ${id}: ${erro}`);
        }
    }

    // Lista músicas do artista
    async listaMusicasArtista(id: string) {
        try {
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
        } catch (erro) {
            throw new Error(`Erro ao listar músicas do artista: ${erro}`);
        }
    }
}

export default new ServiceArtista();
