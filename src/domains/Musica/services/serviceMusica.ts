import prisma from '../../../../config/prismaClient.js';
import { Prisma } from '@prisma/client';
import { InvalidParamError, QueryError } from '../../../../errors/index.js';

class ServiceMusica {
    // Cria nova música
    async criarMusica(body: Prisma.MusicaCreateInput) {

        if (body.nome == null){
            throw new InvalidParamError("Nome não informado!")
        }
        const musica: Prisma.MusicaCreateInput = {
            nome: body.nome,
            genero: body.genero,
            album: body.album,
        };

        try {
            const musicaCriada = await prisma.musica.create({ data: musica });

            return musicaCriada;
        } catch (erro) {
            throw new Error(`Erro ao criar música: ${erro}`);
        }
    }

    // Deleta música com id especifico
    async deletarMusica(id: string) {
        const musicaEncontrada = await prisma.musica.findUnique({
            where:{
                id: id
            }
        })
        if (musicaEncontrada == null){
            throw new QueryError("Id inválido!")
        }
        if (id == null){
            throw new InvalidParamError("Id não informado!")
        }
        try {
            await prisma.musica.delete({
                where: {
                    id: id,
                },
            });
        } catch (erro) {
            throw new Error(`Erro ao deletar música: ${erro}`);
        }
    }

    // Lista todas as músicas registradas
    async listarMusicas() {
        try {
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
        } catch (erro) {
            throw new Error(`Erro ao listar músicas: ${erro}`);
        }
    }

    // Retoma a música com id especificado
    async listarMusicaID(id: string) {
        const musicaEncontrada = await prisma.musica.findUnique({
            where:{
                id: id
            }
        })
        if (musicaEncontrada == null){
            throw new QueryError("Id inválido!")
        }
        if (id == null){
            throw new InvalidParamError("Id não informado!")
        }
        try {
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
            return musica;
        } catch (erro) {
            throw new Error(`Erro ao retomar musica de id ${id}: ${erro}`);
        }
    }

    // Atualiza informações da música de id especificado
    async atualizaMusica(id: string, body: Prisma.MusicaUpdateInput) {
        const musicaUpdate: Prisma.MusicaUpdateInput = { ...body };
        const musicaEncontrada = await prisma.musica.findUnique({
            where:{
                id: id
            }
        })
        if (musicaEncontrada == null){
            throw new QueryError("Id inválido!")
        }
        if (id == null){
            throw new InvalidParamError("Id não informado!")
        }
        try {
            const musica = await prisma.musica.update({
                where: {
                    id: id,
                },
                data: musicaUpdate,
            });
            return musica;
        } catch (erro) {
            throw new Error(`Erro ao atualizar música de id ${id}: ${erro}`);
        }
    }

    // Vincula um artista à musica
    async vinculaMusicaArtista(artistaId: string, musicaId: string) {
        const musicaEncontrada = await prisma.musica.findUnique({
            where:{
                id: musicaId
            }
        })
        const artistaEncontrado = await prisma.artista.findUnique({
            where:{
                id: artistaId
            }
        })
        if (musicaEncontrada == null){
            throw new QueryError("Id da música inválido!")
        }
        if (artistaEncontrado == null){
            throw new QueryError("Id do artista inválido!")
        }
        if (musicaId == null){
            throw new InvalidParamError("Id da música não informado!")
        }
        if (artistaId == null){
            throw new InvalidParamError("Id do artista não informado!")
        }
        try {
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
        } catch (e) {
            throw new Error(`Erro ao vincular artista à música: ${e}`);
        }
    }

    // Desvincula um artista à musica
    async desvinculaMusicaArtista(where: Prisma.AutoriaWhereUniqueInput) {
        const musicaEncontrada = await prisma.musica.findUnique({
            where:{
                id: where.artistaId_musicaId?.musicaId
            }
        })
        const artistaEncontrado = await prisma.artista.findUnique({
            where:{
                id: where.artistaId_musicaId?.artistaId
            }
        })
        if (musicaEncontrada == null){
            throw new QueryError("Id da música inválido!")
        }
        if (artistaEncontrado == null){
            throw new QueryError("Id do artista inválido!")
        }
        if ( where.artistaId_musicaId?.musicaId == null){
            throw new InvalidParamError("Id da música não informado!")
        }
        if (where.artistaId_musicaId?.artistaId == null){
            throw new InvalidParamError("Id do artista não informado!")
        }
        try {
            const autoria = await prisma.autoria.delete({
                where: where,
            });
            return autoria;
        } catch (e) {
            throw new Error(`Erro ao desvincular artista à música: ${e}`);
        }
    }
}

export default new ServiceMusica();
