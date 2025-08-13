import { Response, Request, Router, NextFunction } from 'express';
import serviceUsuario from '../services/serviceUsuario.js';
import statusCodes from '../../../../utils/constants/statusCodes.js';
import { verifyJWT, checkRole, logout } from '../../../../middlewares/auth.js';
import { Prisma, Privilegios } from '@prisma/client';
const router = Router();

// Retoma as informações da conta do usuário
router.get(
    '/',
    verifyJWT,
    checkRole([Privilegios.PADRAO, Privilegios.ASSINANTE, Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await serviceUsuario.listarUsuarioID(req.usuario.id);
            res.status(statusCodes.SUCCESS);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },
);

// Atualiza as informações da conta do usuário (menos a senha)
router.put(
    '/update',
    verifyJWT,
    checkRole([Privilegios.PADRAO, Privilegios.ASSINANTE, Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_info: Prisma.UsuarioUpdateInput = {
                email: req.body.email,
                nome: req.body.nome,
                foto: req.body.foto,
            };
            const user = await serviceUsuario.atualizaUsuario(req.usuario.id, user_info);
            res.status(statusCodes.SUCCESS);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },
);

// Atualiza a senha do usuário
router.put(
    '/password',
    verifyJWT,
    checkRole([Privilegios.PADRAO, Privilegios.ASSINANTE, Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_info: Prisma.UsuarioUpdateInput = {
                senha: req.body.senha,
            };
            const user = await serviceUsuario.atualizaUsuario(req.usuario.id, user_info);
            res.status(statusCodes.SUCCESS);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },
);

// Deleta a conta do usuário
router.delete(
    '/delete',
    verifyJWT,
    checkRole([Privilegios.PADRAO, Privilegios.ASSINANTE, Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await serviceUsuario.deletarUsuario(req.usuario.id);
            await logout(req, res, next);
            res.status(statusCodes.SUCCESS);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },
);

// Registra uma música no histórico da conta do usuário
router.post(
    '/listen/:id',
    verifyJWT,
    checkRole([Privilegios.PADRAO, Privilegios.ASSINANTE, Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const musicas_salvas = await serviceUsuario.criaHistoricoUsuario(
                req.usuario.id,
                req.params.id,
            );
            res.status(statusCodes.SUCCESS);
            res.json(musicas_salvas);
        } catch (error) {
            next(error);
        }
    },
);

// Retira uma música do histórico da conta do usuário
router.delete(
    '/unlisten/:id',
    verifyJWT,
    checkRole([Privilegios.PADRAO, Privilegios.ASSINANTE, Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const musicas_salvas = await serviceUsuario.removeHistoricoUsuario(req.params.id);
            res.status(statusCodes.SUCCESS);
            res.json(musicas_salvas);
        } catch (error) {
            next(error);
        }
    },
);

// Mostra o histórico da conta do usuário
router.get(
    '/history',
    verifyJWT,
    checkRole([Privilegios.PADRAO, Privilegios.ASSINANTE, Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const historico = await serviceUsuario.listaHistoricoUsuario(req.usuario.id);
            res.status(statusCodes.SUCCESS);
            res.json(historico);
        } catch (error) {
            next(error);
        }
    },
);

// Salva uma música na conta do usuário
router.post(
    '/like/:id',
    verifyJWT,
    checkRole([Privilegios.PADRAO, Privilegios.ASSINANTE, Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const musicas_salvas = await serviceUsuario.salvaMusicaUsuario(
                req.usuario.id,
                req.params.id,
            );
            res.status(statusCodes.SUCCESS);
            res.json(musicas_salvas);
        } catch (error) {
            next(error);
        }
    },
);

// Retira uma música das salvas da conta do usuário
router.delete(
    '/unlike/:id',
    verifyJWT,
    checkRole([Privilegios.PADRAO, Privilegios.ASSINANTE, Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const musicas_salvas = await serviceUsuario.removeMusicaSalvaUsuario(
                req.usuario.id,
                req.params.id,
            );
            res.status(statusCodes.SUCCESS);
            res.json(musicas_salvas);
        } catch (error) {
            next(error);
        }
    },
);

// Mostra as músicas salvas da conta do usuário
router.get(
    '/favorites',
    verifyJWT,
    checkRole([Privilegios.PADRAO, Privilegios.ASSINANTE, Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const musicas_salvas = await serviceUsuario.listaMusicasSalvasUsuario(req.usuario.id);
            res.status(statusCodes.SUCCESS);
            res.json(musicas_salvas);
        } catch (error) {
            next(error);
        }
    },
);

export default router;
