import { Request, Response, NextFunction, Router } from 'express';
import { Prisma, Privilegios } from '@prisma/client';
import serviceUsuario from '../services/serviceUsuario.js';
import statusCodes from '../../../../utils/constants/statusCodes.js';

const router = Router();

// Registra nova conta como usuário
router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_info: Prisma.UsuarioCreateInput = {
            email: req.body.email,
            nome: req.body.nome,
            foto: req.body.foto,
            senha: req.body.senha,
            privilegio: Privilegios.PADRAO,
        };
        const user = await serviceUsuario.criarUsuario(user_info);
        res.status(statusCodes.CREATED);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

export default router;
