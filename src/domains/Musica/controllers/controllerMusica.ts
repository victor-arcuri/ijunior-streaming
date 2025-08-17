import { Request, Response } from 'express';
import MusicService from '../services/serviceMusica';
import statusCodes from '../../../../config/statusCodes';
import prisma from '../../../../config/prismaClient';
import { verifyJWT, checkRole } from '../../../../middlewares/auth';
import { Privilegios } from '@prisma/client';

export default class MusicController {
    constructor(private service = new MusicService()) {}

    // Verifica autenticação e permissões
    private verifyAccess(roles: Privilegios[]) {
        return [verifyJWT, checkRole(roles)];
    }

    // Lista todas músicas (ordem A-Z)
    async listarTodas(req: Request, res: Response) {
        try {
            const musicas = await this.service.listarMusicas();
            res.status(statusCodes.SUCCESS).json(musicas);
        } catch (error) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Falha ao buscar músicas'
            });
        }
    }

    // Busca música específica
    async buscarPorId(req: Request, res: Response) {
        try {
            const musica = await this.service.listarMusicaID(req.params.id);
            musica 
                ? res.status(statusCodes.SUCCESS).json(musica)
                : res.status(statusCodes.NOT_FOUND).json({ error: 'Música não encontrada' });
        } catch (error) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Falha ao buscar música'
            });
        }
    }

    // Registra música ouvida pelo usuário
    async marcarComoOuvida(req: Request, res: Response) {
        try {
            await prisma.musicaOuvida.create({
                data: {
                    usuarioId: req.user.id,
                    musicaId: req.params.musicaId,
                    data: new Date()
                }
            });
            res.status(statusCodes.SUCCESS).json({ message: 'Música registrada!' });
        } catch (error) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Falha ao registrar música'
            });
        }
    }

    // Cria nova música (admin)
    criar = [
        ...this.verifyAccess(['ADMIN']),
        async (req: Request, res: Response) => {
            try {
                const musica = await this.service.criarMusica(req.body);
                res.status(statusCodes.CREATED).json(musica);
            } catch (error) {
                res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                    error: 'Falha ao criar música'
                });
            }
        }
    ]

    // Atualiza música (admin)
    atualizar = [
        ...this.verifyAccess(['ADMIN']),
        async (req: Request, res: Response) => {
            try {
                const musica = await this.service.atualizaMusica(req.params.id, req.body);
                res.status(statusCodes.SUCCESS).json(musica);
            } catch (error) {
                res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                    error: 'Falha ao atualizar música'
                });
            }
        }
    ]

    // Remove música (admin)
    remover = [
        ...this.verifyAccess(['ADMIN']),
        async (req: Request, res: Response) => {
            try {
                await this.service.deletarMusica(req.params.id);
                res.status(statusCodes.NO_CONTENT).send();
            } catch (error) {
                res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                    error: 'Falha ao remover música'
                });
            }
        }
    ]

    // Lista músicas ouvidas pelo usuário
    async historico(req: Request, res: Response) {
        try {
            const historico = await prisma.musicaOuvida.findMany({
                where: { usuarioId: req.user.id },
                include: { musica: true },
                orderBy: { data: 'desc' }
            });
            res.status(statusCodes.SUCCESS).json(historico);
        } catch (error) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Falha ao buscar histórico'
            });
        }
    }

    // Vincula artista à música (admin)
    vincularArtista = [
        ...this.verifyAccess(['ADMIN']),
        async (req: Request, res: Response) => {
            try {
                const vinculo = await this.service.vinculaMusicaArtista(
                    req.params.artistaId, 
                    req.params.musicaId
                );
                res.status(statusCodes.SUCCESS).json(vinculo);
            } catch (error) {
                res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                    error: 'Falha ao vincular artista'
                });
            }
        }
    ]

    // Desvincula artista (admin)
    desvincularArtista = [
        ...this.verifyAccess(['ADMIN']),
        async (req: Request, res: Response) => {
            try {
                const resultado = await this.service.desvinculaMusicaArtista({
                    artistaId_musicaId: {
                        artistaId: req.params.artistaId,
                        musicaId: req.params.musicaId
                    }
                });
                res.status(statusCodes.SUCCESS).json(resultado);
            } catch (error) {
                res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                    error: 'Falha ao desvincular artista'
                });
            }
        }
    ]
}
