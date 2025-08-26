import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { TokenError } from '../../errors/TokenError.js';
import statusCodes from '../../utils/constants/statusCodes.js';
import { LoginError } from '../../errors/LoginError.js';
import { PermissionError } from '../../errors/PermissionError.js';
import { JsonWebTokenError } from 'jsonwebtoken';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);

    if (err instanceof ZodError) {
        return res.status(statusCodes.BAD_REQUEST).json({
            error: err.issues.map((val) => val.message),
        });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(statusCodes.BAD_REQUEST).json({
                error: 'Email inválido',
            });
        }
        if (err.code === 'P2025') {
            return res.status(statusCodes.BAD_REQUEST).json({ error: 'UUID v4 inválido' });
        }
    }

    if (err instanceof TokenError) {
        return res.status(statusCodes.BAD_REQUEST).json({ error: err.message });
    }

    if (err instanceof LoginError) {
        return res.status(statusCodes.FORBIDDEN).json({ error: err.message });
    }

    if (err instanceof PermissionError) {
        return res.status(statusCodes.UNAUTHORIZED).json({ error: err.message });
    }

    if (err instanceof SyntaxError) {
        return res.status(400).json({ error: 'Json inválido' });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(400).json({ error: 'JWT inválido' });
    }

    res.status(501).json({ error: 'Internal Server Error' });
};
