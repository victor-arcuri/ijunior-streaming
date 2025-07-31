import prisma from '../../database/prismaClient';
import { v4 as uuidv4 } from 'uuid'; // Geração automática de id
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Usuario } from '@prisma/client';

class ServiceUsuario {
    // Cria novo usuário
    async criarUsuario(body: Usuario) {
        const usuario = {
            id: uuidv4(),
            nome: body.nome,
            email: body.email,
            senha: body.senha,
            privilegio: body.privilegio,
            foto: body.foto,
        } as Usuario;

        try {
            const usuarioCriado = await prisma.usuario.create({ data: usuario });

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
    async listarUsuarios() {
        try {
            const usuarios = await prisma.usuario.findMany({
                orderBy: {
                    id: 'asc',
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    senha: false,
                    privilegio: true,
                    foto: true,
                },
            });
            return usuarios;
        } catch (erro) {
            throw new Error(`Erro ao listar usuários: ${erro}`);
        }
    }

    // Retoma o usuário com id especificado
    async listarUsuarioID(id: string) {
        try {
            const usuario = await prisma.usuario.findFirst({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    senha: false,
                    privilegio: true,
                    foto: true,
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
            const usuario = await prisma.usuario.findFirst({
                where: {
                    email: email,
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    senha: false,
                    privilegio: true,
                    foto: true,
                },
            });
            return usuario;
        } catch (erro) {
            throw new Error(`Erro ao retomar usuário de email ${email}: ${erro}`);
        }
    }

    // Atualiza informações do usuário de id especificado
    async atualizaUsuario(id: string, body: Usuario) {
        try {
            const usuario = await prisma.usuario.update({
                where: {
                    id: id,
                },
                data: {
                    nome: body.nome,
                    email: body.email,
                    senha: body.senha,
                    privilegio: body.privilegio,
                    foto: body.foto,
                },
            });
            return usuario;
        } catch (erro) {
            throw new Error(`Erro ao atualizar usuário de id ${id}: ${erro}`);
        }
    }
}

export default new ServiceUsuario();
