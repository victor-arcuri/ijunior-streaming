import prisma from '../../../../config/prismaClient.js';
import bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const UsuarioCreate = z.object({
    email: z.email('Email inválido'),
    nome: z.string('Nome inválido'),
    privilegio: z.enum(['PADRAO', 'ADMIN'], 'Privilégio inválido').optional(),
    senha: z.string().min(8, 'Senha tem que ter no mínimo 8 caracteres'),
    foto: z.string('Foto inválida').optional(),
});

const UsuarioUpdate = z
    .object({
        email: z.email('Email inválido').optional(),
        nome: z.string('Nome inválido').optional(),
        privilegio: z.enum(['PADRAO', 'ADMIN'], 'Privilégio inválido').optional(),
        senha: z.string().min(8, 'Senha tem que ter no mínimo 8 caracteres').optional(),
        foto: z.string('Foto inválida').optional(),
    })
    .refine(
        (data) =>
            Object.values(data).some((val) => val !== undefined && val !== null && val !== ''),
        {
            message: 'Update de usuário inválido',
        },
    );

class ServiceUsuario {
    // Cria novo usuário
    async criarUsuario(body: Prisma.UsuarioCreateInput) {
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
            if (erro instanceof PrismaClientKnownRequestError) {
                if (erro.code === 'P2002') {
                    throw new Error('Erro ao criar usuário: e-mail já está em uso');
                }
            }

            throw new Error(`Erro ao criar usuário: ${erro}`);
        }
    }

    // Deleta usuário com id especifico
    async deletarUsuario(id: string) {
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
