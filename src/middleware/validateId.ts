import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const validId = z.uuidv4('UUID v4 inválido');

export function validateId(req: Request, res: Response, next: NextFunction) {
    validId.parse(req.params.id)
    next()
}