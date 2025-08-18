import { Router, Request, Response, NextFunction } from 'express';
import serviceUsuario from '../services/serviceUsuario.js';
import { Prisma, Privilegios } from '@prisma/client';
import statusCodes from '../../../../utils/constants/statusCodes.js';
import { validateId } from '../../../middlewares/validateId.js';
import { verifyJWT, checkRole, isNotLogged, login, logout } from '../../../middlewares/auth.js';

const router = Router();

/**
 * ROTAS DE AUTENTICAÇÃO
 * /users/login, /users/logout
 * (essas rotas ficam sob o prefixo que você montar no index.ts, ex: app.use('/users', router))
 */
router.post('/login', isNotLogged, login);
router.post('/logout', verifyJWT, logout);

// ROTA DE CRIAÇÃO DE USUÁRIO
router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body: Prisma.UsuarioCreateInput = {
            email: req.body.email,
            nome: req.body.nome,
            foto: req.body.foto,
            senha: req.body.senha,
            privilegio: Privilegios.PADRAO,
        };
        const user = await serviceUsuario.criarUsuario(body);
        res.status(statusCodes.CREATED).json(user);
    } catch (err) {
        next(err);
    }
});

/**
 * ROTAS "ACCOUNT" (usuário logado mexe apenas na própria conta)
 * /users/account...
 */
router.get('/account', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.usuario.id;
        const user = await serviceUsuario.listarUsuarioID(userId);
        if (!user)
            return res.status(statusCodes.NOT_FOUND).json({ message: 'Usuário não encontrado' });
        res.status(statusCodes.SUCCESS).json(user);
    } catch (err) {
        next(err);
    }
});

router.put(
    '/account/update',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.usuario.id;
            const body: Prisma.UsuarioUpdateInput = {
                email: req.body.email,
                nome: req.body.nome,
                foto: req.body.foto,
            };
            const user = await serviceUsuario.atualizaUsuario(userId, body);
            res.status(statusCodes.SUCCESS).json(user);
        } catch (err) {
            next(err);
        }
    },
);

router.put(
    '/account/password',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.usuario.id;
            const user = await serviceUsuario.atualizaUsuario(userId, { senha: req.body.senha });
            res.status(statusCodes.SUCCESS).json(user);
        } catch (err) {
            next(err);
        }
    },
);

router.delete(
    '/account/delete',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.usuario.id;
            await serviceUsuario.deletarUsuario(userId);
            next();
        } catch (err) {
            next(err);
        }
    },
    logout,
);

/**
 * Histórico (listen/unlisten/history) — usa o usuário logado
 * Observação: removeHistoricoUsuario do service recebe o ID do registro de histórico.
 * Então aqui, em /unlisten/:id, o :id é o ID do histórico (não o id da música).
 */
router.post(
    '/account/listen/:id', // :id = musicaId
    verifyJWT,
    validateId,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.usuario.id;
            const musicaId = req.params.id;
            const hist = await serviceUsuario.criaHistoricoUsuario(userId, musicaId);
            res.status(statusCodes.SUCCESS).json(hist);
        } catch (err) {
            next(err);
        }
    },
);

router.delete(
    '/account/unlisten/:id', // :id = historicoId (conforme o service atual)
    verifyJWT,
    validateId,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const historico = await serviceUsuario.removeHistoricoUsuario(req.params.id);
            res.status(statusCodes.SUCCESS).json(historico);
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    '/account/history',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.usuario.id;
            const historico = await serviceUsuario.listaHistoricoUsuario(userId);
            res.status(statusCodes.SUCCESS).json(historico);
        } catch (err) {
            next(err);
        }
    },
);

/**
 * Favoritos (like/unlike/favorites) — usa o usuário logado
 */
router.post(
    '/account/like/:id', // :id = musicaId
    verifyJWT,
    validateId,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.usuario.id;
            const musicaId = req.params.id;
            const fav = await serviceUsuario.salvaMusicaUsuario(userId, musicaId);
            res.status(statusCodes.SUCCESS).json(fav);
        } catch (err) {
            next(err);
        }
    },
);

router.delete(
    '/account/unlike/:id', // :id = musicaId
    verifyJWT,
    validateId,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.usuario.id;
            const musicaId = req.params.id;
            const fav = await serviceUsuario.removeMusicaSalvaUsuario(userId, musicaId);
            res.status(statusCodes.SUCCESS).json(fav);
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    '/account/favorites',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.usuario.id;
            const favs = await serviceUsuario.listaMusicasSalvasUsuario(userId);
            res.status(statusCodes.SUCCESS).json(favs);
        } catch (err) {
            next(err);
        }
    },
);

/**
 * ROTAS ADMIN (seguindo o rascunho do seu chefe)
 * /users (GET), /users/:id (GET), /users/admin/create (POST),
 * /users/update/:id (PUT), /users/delete/:id (DELETE)
 */
router.get(
    '/',
    verifyJWT,
    checkRole([Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string | undefined;
            const limit = req.query.limit ? Number(req.query.limit) : undefined;
            const sort = (req.query.sort as string | undefined)?.toLowerCase();
            const order: 'asc' | 'desc' | undefined =
                sort === 'asc' || sort === 'desc' ? sort : undefined;

            const result = email
                ? await serviceUsuario.listarUsuarioEmail(email)
                : await serviceUsuario.listarUsuarios(limit, order);

            res.status(statusCodes.SUCCESS).json(result);
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    '/:id',
    verifyJWT,
    validateId,
    checkRole([Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await serviceUsuario.listarUsuarioID(req.params.id);
            if (!user)
                return res
                    .status(statusCodes.NOT_FOUND)
                    .json({ message: 'Usuário não encontrado' });
            res.status(statusCodes.SUCCESS).json(user);
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    '/admin/create',
    verifyJWT,
    checkRole([Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: Prisma.UsuarioCreateInput = {
                email: req.body.email,
                nome: req.body.nome,
                foto: req.body.foto,
                senha: req.body.senha,
                privilegio: req.body.privilegio,
            };
            const user = await serviceUsuario.criarUsuario(body);
            res.status(statusCodes.CREATED).json(user);
        } catch (err) {
            next(err);
        }
    },
);

router.put(
    '/update/:id',
    verifyJWT,
    validateId,
    checkRole([Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: Prisma.UsuarioUpdateInput = {
                email: req.body.email,
                nome: req.body.nome,
                foto: req.body.foto,
                senha: req.body.senha,
                privilegio: req.body.privilegio,
            };
            const user = await serviceUsuario.atualizaUsuario(req.params.id, body);
            res.status(statusCodes.SUCCESS).json(user);
        } catch (err) {
            next(err);
        }
    },
);

router.delete(
    '/delete/:id',
    verifyJWT,
    validateId,
    checkRole([Privilegios.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await serviceUsuario.deletarUsuario(req.params.id);
            if (req.usuario.id != req.params.id) {
                res.status(statusCodes.SUCCESS).json(user);
            }
            next();
        } catch (err) {
            next(err);
        }
    },
    logout,
);

export default router;
