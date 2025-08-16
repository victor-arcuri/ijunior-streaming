import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { TokenError } from '../../errors/TokenError.js';
import statusCodes from '../../utils/constants/statusCodes.js';

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

    res.status(501).json({ error: 'Internal Server Error' });
};
