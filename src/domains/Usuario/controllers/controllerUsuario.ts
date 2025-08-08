import { Router, Request, Response, NextFunction } from 'express';
import serviceUsuario from '../services/serviceUsuario.js';
import { Prisma } from '@prisma/client';

const router = Router();

// Lista os usuários (query param de email para retomar o usuário a partir de seu email)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.query.email as string | undefined;
        const limit = req.query.limit ? Number(req.query.limit) : undefined;
        let result;

        if (email) {
            result = await serviceUsuario.listarUsuarioEmail(email);
        } else {
            result = await serviceUsuario.listarUsuarios(limit);
        }
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// Retoma o usuário a partir de seu ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await serviceUsuario.listarUsuarioID(req.params.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Deleta o usuário a partir de seu id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await serviceUsuario.deletarUsuario(req.params.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Atualiza um usuário
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_info: Prisma.UsuarioUpdateInput = {
            email: req.body.email,
            nome: req.body.nome,
            foto: req.body.foto,
            senha: req.body.senha,
        };
        const user = await serviceUsuario.atualizaUsuario(req.params.id, user_info);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Adiciona um novo usuário
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_info: Prisma.UsuarioCreateInput = {
            email: req.body.email,
            nome: req.body.nome,
            foto: req.body.foto,
            senha: req.body.senha,
        };
        const user = await serviceUsuario.criarUsuario(user_info);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Lista músicas salvas do usuário
router.get('/:id/salvas', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const musicas_salvas = await serviceUsuario.listaMusicasSalvasUsuario(req.params.id);
        res.json(musicas_salvas);
    } catch (error) {
        next(error);
    }
});

// Lista histórico do usuário
router.get('/:id/historico', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const historico = await serviceUsuario.listaHistoricoUsuario(req.params.id);
        res.json(historico);
    } catch (error) {
        next(error);
    }
});

export default router;
