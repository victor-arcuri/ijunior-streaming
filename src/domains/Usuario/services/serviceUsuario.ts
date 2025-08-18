import prisma from '../../../../config/prismaClient.js';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { TokenError } from '../../../../errors/TokenError.js';

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
        const usuarioValido = UsuarioCreate.parse(body);

        usuarioValido.senha = await bcrypt.hash(usuarioValido.senha, 10);

        const usuarioCriado = await prisma.usuario.create({
            data: usuarioValido,
            omit: {
                senha: true,
            },
        });

        return usuarioCriado;
    }

    // Deleta usuário com id especifico
    async deletarUsuario(id: string) {
        await prisma.usuario.delete({
            where: {
                id: id,
            },
        });
    }

    // Lista todos os usuários registrados
    async listarUsuarios(limit?: number, order?: Prisma.SortOrder) {
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
    }

    // Retoma o usuário com id especificado
    async listarUsuarioID(id: string) {
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: id,
            },
            omit: {
                senha: true,
            },
        });

        if (!usuario) {
            throw new TokenError('UUID v4 inválido');
        }

        return usuario;
    }

    // Retoma o usuário com email especificado
    async listarUsuarioEmail(email: string) {
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email,
            },
            omit: {
                senha: true,
            },
        });

        if (!usuario) {
            throw new TokenError('UUID v4 inválido');
        }

        return usuario;
    }

    // Atualiza informações do usuário de id especificado
    async atualizaUsuario(id: string, body: Prisma.UsuarioUpdateInput) {
        const usuarioUpdate = UsuarioUpdate.parse(body);
        if (usuarioUpdate.senha) {
            usuarioUpdate.senha = await bcrypt.hash(usuarioUpdate.senha, 10);
        }
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
    }

    async listaHistoricoUsuario(id: string) {
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
    }

    async listaMusicasSalvasUsuario(id: string) {
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
    }

    async salvaMusicaUsuario(usuario_id: string, musica_id: string) {
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
    }

    async removeMusicaSalvaUsuario(usuario_id: string, musica_id: string) {
        await prisma.musicaSalva.delete({
            where: {
                usuarioId_musicaId: {
                    usuarioId: usuario_id,
                    musicaId: musica_id,
                },
            },
        });
    }

    async criaHistoricoUsuario(usuario_id: string, musica_id: string) {
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
    }

    async removeHistoricoUsuario(log_id: string) {
        await prisma.logMusica.delete({
            where: {
                id: log_id,
            },
        });
    }
}

export default new ServiceUsuario();
