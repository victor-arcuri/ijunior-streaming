import prisma from '../../../../config/prismaClient.js';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import {QueryError, InvalidParamError} from '../../../../errors'

class ServiceUsuario {
    // Cria novo usuário
    async criarUsuario(body: Prisma.UsuarioCreateInput) {

        const usuarioExistente = await prisma.usuario.findUnique({
            where:{
                email: body.email
            }
        })

        if (usuarioExistente){
            throw new QueryError("Email já cadastrado!")
        }
        if (body.email == null){
            throw new InvalidParamError("Email não informado!")
        }
        if (body.senha == null){
            throw new InvalidParamError("Senha não informada!")
        }
        if (body.nome == null){
            throw new InvalidParamError("Nome não informado!")
        }

        const hashSenha = await bcrypt.hash(body.senha, 10);
        const usuario: Prisma.UsuarioCreateInput = {
            nome: body.nome,
            email: body.email,
            senha: hashSenha,
            privilegio: body.privilegio,
            foto: body.foto,
        };

        try {
            const usuarioCriado = await prisma.usuario.create({
                data: usuario,
                omit: {
                    senha: true,
                },
            });

            return usuarioCriado;
        } catch (erro) {
            throw new Error(`Erro ao criar usuário: ${erro}`);
        }
    }

    // Deleta usuário com id especifico
    async deletarUsuario(id: string) {
        const usuarioEncontrado = await prisma.usuario.findUnique({
            where:{
                id: id
            }
        })
        if (usuarioEncontrado == null){
            throw new QueryError("Id inválido!")
        }
        if (id == null){
            throw new InvalidParamError("Id não informado!")
        }
        try {
            await prisma.usuario.delete({
                where: {
                    id: id,
                },
            });
        } catch (erro) {
            throw new Error(`Erro ao deletar usuário: ${erro}`);
        }
    }

    // Lista todos os usuários registrados
    async listarUsuarios(limit?: number, order?: Prisma.SortOrder) {
        if ((order != null) && (order != 'asc' || 'desc')){
            throw new InvalidParamError("Sort order inválida! Ordens válidas: 'asc' para ordenamento ascendente e 'desc' para ordenamento descendente.")
        }
        try {
            const usuarios = await prisma.usuario.findMany({
                orderBy: {
                    id: order ?? 'asc',
                },
                omit: {
                    senha: true,
                },
                take: typeof limit === 'number' ? limit : undefined,
            });
            return usuarios;
        } catch (erro) {
            throw new Error(`Erro ao listar usuários: ${erro}`);
        }
    }

    // Retoma o usuário com id especificado
    async listarUsuarioID(id: string) {
        const usuarioEncontrado = await prisma.usuario.findUnique({
            where:{
                id: id
            }
        })
        if (usuarioEncontrado == null){
            throw new QueryError("Id inválido!")
        }
        if (id == null){
            throw new InvalidParamError("Id não informado!")
        }
        try {
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: id,
                },
                omit: {
                    senha: true,
                },
            });
            return usuario;
        } catch (erro) {
            throw new Error(`Erro ao retomar usuário de id ${id}: ${erro}`);
        }
    }

    // Retoma o usuário com email especificado
    async listarUsuarioEmail(email: string) {
        const usuarioEncontrado = await prisma.usuario.findUnique({
            where:{
                email: email
            }
        })
        if (usuarioEncontrado == null){
            throw new QueryError("Email inválido!")
        }
        if (email == null){
            throw new InvalidParamError("Email não informado!")
        }
        try {
            const usuario = await prisma.usuario.findUnique({
                where: {
                    email: email,
                },
                omit: {
                    senha: true,
                },
            });
            return usuario;
        } catch (erro) {
            throw new Error(`Erro ao retomar usuário de email ${email}: ${erro}`);
        }
    }

    // Atualiza informações do usuário de id especificado
    async atualizaUsuario(id: string, body: Prisma.UsuarioUpdateInput) {
        const usuarioEncontrado = await prisma.usuario.findUnique({
            where:{
                id: id
            }
        })
        if (usuarioEncontrado == null){
            throw new QueryError("Id inválido!")
        }
        if (id == null){
            throw new InvalidParamError("Id não informado!")
        }

        const usuarioUpdate: Prisma.UsuarioUpdateInput = { ...body };

        if (typeof body.senha === 'string') {
            usuarioUpdate.senha = await bcrypt.hash(body.senha, 10);
        }
        try {
            const usuario = await prisma.usuario.update({
                where: {
                    id: id,
                },
                omit: {
                    senha: true,
                },
                data: usuarioUpdate,
            });
            return usuario;
        } catch (erro) {
            throw new Error(`Erro ao atualizar usuário de id ${id}: ${erro}`);
        }
    }

    async listaHistoricoUsuario(id: string) {
        const usuarioEncontrado = await prisma.usuario.findUnique({
            where:{
                id: id
            }
        })
        if (usuarioEncontrado == null){
            throw new QueryError("Id inválido!")
        }
        if (id == null){
            throw new InvalidParamError("Id não informado!")
        }
        try {
            const historico = await prisma.logMusica.findMany({
                where: {
                    usuarioId: id,
                },
                orderBy: {
                    tempo: 'desc',
                },
                select: {
                    tempo: true,
                    musica: { select: { nome: true } },
                    id: true,
                },
            });
            return historico;
        } catch (erro) {
            throw new Error(`Erro ao listar histórico: ${erro}`);
        }
    }

    async listaMusicasSalvasUsuario(id: string) {
        const usuarioEncontrado = await prisma.usuario.findUnique({
            where:{
                id: id
            }
        })
        if (usuarioEncontrado == null){
            throw new QueryError("Id inválido!")
        }
        if (id == null){
            throw new InvalidParamError("Id não informado!")
        }
        try {
            const musicasSalvas = await prisma.musicaSalva.findMany({
                where: {
                    usuarioId: id,
                },
                select: {
                    musica: {
                        select: {
                            nome: true,
                            autoria: {
                                select: {
                                    artista: {
                                        select: {
                                            nome: true,
                                        },
                                    },
                                },
                            },
                            id: true,
                        },
                    },
                },
            });
            return musicasSalvas;
        } catch (erro) {
            throw new Error(`Erro ao listar músicas salvas: ${erro}`);
        }
    }

    async salvaMusicaUsuario(usuario_id: string, musica_id: string) {
        const usuarioEncontrado = await prisma.usuario.findUnique({
            where:{
                id: usuario_id
            }
        })
        const musicaEncontrada = await prisma.musica.findUnique({
            where:{
                id: musica_id
            }
        })
        if (usuarioEncontrado == null){
            throw new QueryError("Id de usuário inválido!")
        }
        if (usuario_id == null){
            throw new InvalidParamError("Id de usuário não informado!")
        }

        if (musicaEncontrada == null){
            throw new QueryError("Id de música inválido!")
        }
        if (musica_id == null){
            throw new InvalidParamError("Id de música não informado!")
        }

        try {
            const musicaSalva = await prisma.musicaSalva.create({
                data: {
                    usuario: {
                        connect: {
                            id: usuario_id,
                        },
                    },
                    musica: {
                        connect: {
                            id: musica_id,
                        },
                    },
                },
            });
            return musicaSalva;
        } catch (erro) {
            throw new Error(`Erro ao salvar música: ${erro}`);
        }
    }

    async removeMusicaSalvaUsuario(usuario_id: string, musica_id: string) {
        const usuarioEncontrado = await prisma.usuario.findUnique({
            where:{
                id: usuario_id
            }
        })
        const musicaEncontrada = await prisma.musica.findUnique({
            where:{
                id: musica_id
            }
        })
        if (usuarioEncontrado == null){
            throw new QueryError("Id de usuário inválido!")
        }
        if (usuario_id == null){
            throw new InvalidParamError("Id de usuário não informado!")
        }

        if (musicaEncontrada == null){
            throw new QueryError("Id de música inválido!")
        }
        if (musica_id == null){
            throw new InvalidParamError("Id de música não informado!")
        }
        try {
            await prisma.musicaSalva.delete({
                where: {
                    usuarioId_musicaId: {
                        usuarioId: usuario_id,
                        musicaId: musica_id,
                    },
                },
            });
        } catch (erro) {
            throw new Error(`Erro ao remover música salva: ${erro}`);
        }
    }

    async criaHistoricoUsuario(usuario_id: string, musica_id: string) {
        const usuarioEncontrado = await prisma.usuario.findUnique({
            where:{
                id: usuario_id
            }
        })
        const musicaEncontrada = await prisma.musica.findUnique({
            where:{
                id: musica_id
            }
        })
        if (usuarioEncontrado == null){
            throw new QueryError("Id de usuário inválido!")
        }
        if (usuario_id == null){
            throw new InvalidParamError("Id de usuário não informado!")
        }

        if (musicaEncontrada == null){
            throw new QueryError("Id de música inválido!")
        }
        if (musica_id == null){
            throw new InvalidParamError("Id de música não informado!")
        }
        try {
            const logMusica = await prisma.logMusica.create({
                data: {
                    usuario: {
                        connect: {
                            id: usuario_id,
                        },
                    },
                    musica: {
                        connect: {
                            id: musica_id,
                        },
                    },
                },
            });
            return logMusica;
        } catch (erro) {
            throw new Error(`Erro ao criar log de música: ${erro}`);
        }
    }

    async removeHistoricoUsuario(log_id: string) {
        const logEncontrado = await prisma.logMusica.findUnique({
            where:{
                id: log_id
            }
        })

        if (logEncontrado == null){
            throw new QueryError("Id de log inválido!")
        }
        if (log_id == null){
            throw new InvalidParamError("Id de log não informado!")
        }
        try {
            await prisma.logMusica.delete({
                where: {
                    id: log_id,
                },
            });
        } catch (erro) {
            throw new Error(`Erro ao remover música do histórico: ${erro}`);
        }
    }
}

export default new ServiceUsuario();
