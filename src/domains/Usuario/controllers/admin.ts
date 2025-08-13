import { Response, Request, Router, NextFunction } from 'express';
import serviceUsuario from '../services/serviceUsuario.js';
import statusCodes from '../../../../utils/constants/statusCodes.js';
import { verifyJWT, checkRole, logout} from '../../../../middlewares/auth.js';
import { Prisma, Privilegios } from '@prisma/client';

const router = Router();

// Retoma lista dos usuários
router.get('/', verifyJWT, checkRole([Privilegios.ADMIN]), async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const email = req.query.email as string | undefined;
        const limit = req.query.limit ? Number(req.query.limit) : undefined;
        const sort = (req.query.sort as string | undefined)?.toLowerCase();
        const order: 'asc' | 'desc' | undefined =
            sort === 'asc' || sort === 'desc' ? sort : undefined;
        let result;

        if (email) {
            result = await serviceUsuario.listarUsuarioEmail(email);
        } else {
            result = await serviceUsuario.listarUsuarios(limit, order);
        }
        res.status(statusCodes.SUCCESS);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// Retoma informações de usuário específico
router.get('/:id', verifyJWT, checkRole([Privilegios.ADMIN]), async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const user = await serviceUsuario.listarUsuarioID(req.params.id);
        res.status(statusCodes.SUCCESS);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Cria novo usuário podendo ser admin ou não
router.post('/admin/create', verifyJWT, checkRole([Privilegios.ADMIN]), async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const user_info: Prisma.UsuarioCreateInput = {
            email: req.body.email,
            nome: req.body.nome,
            foto: req.body.foto,
            senha: req.body.senha,
            privilegio: req.body.privilegio,
        };
        const user = await serviceUsuario.criarUsuario(user_info);
        res.status(statusCodes.CREATED);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Atualiza as informações de um usuário
router.put('/update/:id', verifyJWT, checkRole([Privilegios.ADMIN]), async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const user_info: Prisma.UsuarioUpdateInput = {
            email: req.body.email,
            nome: req.body.nome,
            foto: req.body.foto,
            senha: req.body.senha,
            privilegio: req.body.privilegio,
        };
        const user = await serviceUsuario.atualizaUsuario(req.params.id, user_info);
        res.status(statusCodes.SUCCESS);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Remove a conta de um usuário
router.delete('/delete/:id', verifyJWT, checkRole([Privilegios.ADMIN]), async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const user = await serviceUsuario.deletarUsuario(req.params.id);
        if (req.usuario.id == req.params.id){
            logout(req, res, next);
        }
        res.status(statusCodes.SUCCESS);
        res.json(user);
    } catch (error) {
        next(error);
    }
});




export default router;