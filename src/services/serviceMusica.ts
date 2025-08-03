import prisma from '../../database/prismaClient';
import { Prisma } from '@prisma/client';

class ServiceMusica {
    // Cria nova música
    async criarMusica(body: Prisma.MusicaCreateInput) {
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
                      artista: true
                    }
                  }
                }
            });
            return musicas;
        } catch (erro) {
            throw new Error(`Erro ao listar músicas: ${erro}`);
        }
    }

    // Retoma a música com id especificado
    async listarMusicaID(id: string) {
        try {
            const musica = await prisma.musica.findUnique({
                where: {
                    id: id,
                },
                include: {
                  autoria: {
                    include: {
                      artista: true
                    }
                  }
                }
            });
            return musica;
        } catch (erro) {
            throw new Error(`Erro ao retomar musica de id ${id}: ${erro}`);
        }
    }

    // Atualiza informações da música de id especificado
    async atualizaMusica(id: string, body: Prisma.MusicaUpdateInput) {
        const musicaUpdate: Prisma.MusicaUpdateInput = { ...body };
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
    async vinculaMusicaArtista(data:Prisma.AutoriaCreateInput){
      try{
        const autoria = await prisma.autoria.create({
          data: data
        });
        return autoria;
      } catch (e){
          throw new Error(`Erro ao vincular artista à música: ${e}`)
      }
    }
}

export default new ServiceMusica();
