import { Request, Response, NextFunction } from 'express';
import serviceMusica from '../services/serviceMusica.js';
import statusCodes from '../../../../utils/constants/statusCodes.js';
import { validateId } from '../../../middlewares/validateId.js';
import { verifyJWT, checkRole } from '../../../middlewares/auth.js';
import { Privilegios } from '@prisma/client';

export default class MusicController {
    constructor(private service = serviceMusica) {}

    // Verifica autenticação e permissões
    private verifyAccess(roles: Privilegios[]) {
        return [verifyJWT, checkRole(roles)];
    }

    // Lista todas músicas (ordem A-Z)
    listarTodas = [
        ...this.verifyAccess(['ADMIN', 'PADRAO']),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const musicas = await this.service.listarMusicas();
                res.status(statusCodes.SUCCESS).json(musicas);
            } catch (error) {
                next(error);
            }
        },
    ];

    // Lista todos os artistas
    listarArtistas = [
        ...this.verifyAccess(['ADMIN', 'PADRAO']),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const musica = await this.service.listarMusicaID(req.params.id);
                const artistas = musica.autoria;
                res.status(statusCodes.SUCCESS).json(artistas);
            } catch (error) {
                next(error);
            }
        },
    ];

    // Busca música específica
    buscarPorId = [
        ...this.verifyAccess(['ADMIN', 'PADRAO']),
        validateId,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const musica = await this.service.listarMusicaID(req.params.id);
                if (musica) {
                    res.status(statusCodes.SUCCESS).json(musica);
                } else {
                    res.status(statusCodes.NOT_FOUND).json({ error: 'Música não encontrada' });
                }
            } catch (error) {
                next(error);
            }
        },
    ];

    // Cria nova música (admin)
    criar = [
        ...this.verifyAccess(['ADMIN']),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const musica = await this.service.criarMusica(req.body);
                res.status(statusCodes.CREATED).json(musica);
            } catch (error) {
                next(error);
            }
        },
    ];

    // Atualiza música (admin)
    atualizar = [
        ...this.verifyAccess(['ADMIN']),
        validateId,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const musica = await this.service.atualizaMusica(req.params.id, req.body);
                res.status(statusCodes.SUCCESS).json(musica);
            } catch (error) {
                next(error);
            }
        },
    ];

    // Remove música (admin)
    remover = [
        ...this.verifyAccess(['ADMIN']),
        validateId,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.service.deletarMusica(req.params.id);
                res.status(statusCodes.NO_CONTENT).send();
            } catch (error) {
                next(error);
            }
        },
    ];
}
