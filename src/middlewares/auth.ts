import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prismaClient.js';
import { compare } from 'bcrypt';
import statusCodes from '../../utils/constants/statusCodes.js';
import { Usuario } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { Privilegios } from '@prisma/client';

import jwt from 'jsonwebtoken';

const { sign, verify } = jwt;

export function isNotLogged(req: Request, res: Response, next: NextFunction) {
    try {
        const token = cookieExtractor(req);
        if (token) {
            const decoded = verify(token, process.env.SECRET_KEY || '') as JwtPayload;
            req.usuario = decoded.usuario;
        }

        if (req.usuario != null) {
            //throw new LoginError('Usuário já está logado!');

            //Aplicar tratativa correta de erros
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
}

function generateJWT(user: Usuario, res: Response) {
    const body = {
        id: user.id,
        email: user.email,
        privilegio: user.privilegio,
        nome: user.nome,
    };
    const token = sign({ usuario: body }, process.env.SECRET_KEY || '', {
        expiresIn: Number(process.env.JWT_EXPIRATION),
    });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
    });
}

function cookieExtractor(req: Request) {
    let token = null;
    if (req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
    try {
        const token = cookieExtractor(req);
        if (token) {
            const decoded = verify(token, process.env.SECRET_KEY || '') as JwtPayload;
            req.usuario = decoded.usuario;
        }

        if (req.usuario == null) {
            //throw new TokenError('Você precisa estar logado para realizar essa ação!');

            //Aplicar tratativa correta de erros
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await prisma.usuario.findUnique({
            where: {
                email: req.body.email,
            },
        });

        if (!user) {
            //throw new PermissionError('Email e/ou senha incorretos!');

            //Aplicar tratativa correta de erros
            return;
        }
        console.log(req.body.senha, ' ', user.senha);
        const match = await compare(req.body.senha, user.senha);

        if (!match) {
            //throw new PermissionError('Email e/ou senha incorretos!');

            //Aplicar tratativa correta de erros
            return;
        }
        generateJWT(user, res);
        res.status(statusCodes.SUCCESS);
        res.json('Login realizado com sucesso!');
    } catch (error) {
        next(error);
    }
}

export function logout(req: Request, res: Response, next: NextFunction) {
    try {
        res.clearCookie('jwt');
        res.status(statusCodes.SUCCESS).json('Logout realizado com sucesso!');
        next();
    } catch (error) {
        next(error);
    }
}

export function checkRole(roles: Privilegios[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!roles.includes(req.usuario.privilegio)) {
                //throw new PermissionError('Usuário não possui permissão para realizar a ação!');

                //Aplicar tratativa correta de erros
                return;
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}
