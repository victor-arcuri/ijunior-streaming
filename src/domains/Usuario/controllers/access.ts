import { Router } from 'express';
import { isNotLogged, login, logout, verifyJWT, checkRole } from '../../../../middlewares/auth.js';
import { Privilegios } from '@prisma/client';
const router = Router();

// Login do usuário
router.post('/login', isNotLogged, login);

// Logout do usuário
router.post(
    '/logout',
    verifyJWT,
    checkRole([Privilegios.PADRAO, Privilegios.ASSINANTE, Privilegios.ADMIN]),
    logout,
);

export default router;
