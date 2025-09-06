import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prismaClient.js';
import { compare } from 'bcrypt';
import statusCodes from '../../utils/constants/statusCodes.js';
import { Usuario } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { Privilegios } from '@prisma/client';

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { LoginError } from '../../errors/LoginError.js';
import { TokenError } from '../../errors/TokenError.js';
import { PermissionError } from '../../errors/PermissionError.js';

const { sign, verify } = jwt;

export function isNotLogged(req: Request, res: Response, next: NextFunction) {
    if (req.usuario != null && !req.cookies['refresh']) {
        throw new LoginError('Usuário já está logado!');
    }
    next();
}

export function generateJWT(user: Omit<Usuario, 'senha'>) {
    const body = {
        id: user.id,
        email: user.email,
        privilegio: user.privilegio,
        nome: user.nome,
    };
    const token = sign({ usuario: body }, process.env.SECRET_KEY || '', {
        expiresIn: Number(process.env.JWT_EXPIRATION),
    });
    return token;
}

function cookieExtractor(req: Request) {
    if (!req.cookies['refresh']) {
        throw new TokenError('Refresh token vazio');
    }
    const decoded = Buffer.from(req.cookies['refresh'], 'base64').toString('utf8');
    return decoded.split('.');
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        throw new TokenError('Authorization no cabeçalho vazio');
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
        const decoded = verify(token, process.env.SECRET_KEY || '') as JwtPayload;
        req.usuario = decoded.usuario;
    }

    if (req.usuario == null) {
        throw new TokenError('Você precisa estar logado para realizar essa ação!');
    }
    next();
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await prisma.usuario.findUnique({
            where: {
                email: req.body.email,
            },
        });

        if (!user) {
            throw new PermissionError('Email e/ou senha incorretos!');
        }
        // console.log(req.body.senha, ' ', user.senha);
        const match = await compare(req.body.senha, user.senha);

        if (!match) {
            throw new PermissionError('Email e/ou senha incorretos!');
        }
        const jwtToken = generateJWT(user);
        await createRefresh(res, next, user.id);
        res.status(statusCodes.SUCCESS);
        res.json({ accessToken: jwtToken });
    } catch (error) {
        next(error);
    }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        const [idUsuario, hash] = cookieExtractor(req);
        res.clearCookie('refresh');
        await prisma.refreshToken.delete({
            where: { tokenHash: hash, idUsuario: { id: idUsuario } },
        });
        res.status(statusCodes.SUCCESS).json('Logout realizado com sucesso!');
    } catch (err) {
        next(err);
    }
}

export function checkRole(roles: Privilegios[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.usuario.privilegio)) {
            throw new PermissionError('Usuário não possui permissão para realizar a ação!');
        }
        next();
    };
}

export async function verifyRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        const [idUsuario, hash] = cookieExtractor(req);

        const token = await prisma.refreshToken.findUnique({
            where: { tokenHash: hash, idUsuario: { id: idUsuario } },
        });
        if (!token) {
            throw new TokenError('Refresh token inválido');
        }
        next();
    } catch (err) {
        next(err);
    }
}

export async function createRefresh(res: Response, next: NextFunction, idUsuario: string) {
    try {
        const hash = crypto.randomBytes(15).toString('hex');
        if (!hash) {
            throw new TokenError('Erro ao criar refresh token');
        }
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        const token = await prisma.refreshToken.create({
            data: {
                tokenHash: hash,
                idUsuario: {
                    connect: {
                        id: idUsuario,
                    },
                },
                expiraEm: sixMonthsFromNow,
            },
        });
        if (!token) {
            throw new TokenError('Erro ao criar refresh token');
        }
        res.cookie('refresh', Buffer.from(idUsuario + '.' + hash).toString('base64'), {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
        });
    } catch (err) {
        next(err);
    }
}
