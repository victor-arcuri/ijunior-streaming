import { Router, Request, Response, NextFunction } from 'express';
import serviceMusica from '../services/serviceMusica.js';
import { Prisma } from '@prisma/client';
import { success } from '../../../../config/statusCodes.js';


const router = Router();

// Lista as músicas
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const music_list = await serviceMusica.listarMusicas();
        res.status(success.SUCCESS);
        res.json(music_list);
    } catch (error) {
        next(error);
    }
});

// Retoma a música a partir de seu ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const music = await serviceMusica.listarMusicaID(req.params.id);
        res.status(success.SUCCESS);
        res.json(music);
    } catch (error) {
        next(error);
    }
});

// Deleta a música a partir de seu id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const music = await serviceMusica.deletarMusica(req.params.id);
        res.status(success.SUCCESS);
        res.json(music);
    } catch (error) {
        next(error);
    }
});

// Atualiza uma música a partir de seu id
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const music_info: Prisma.MusicaUpdateInput = {
            nome: req.body.nome,
            album: req.body.album,
            genero: req.body.genero
        };
        const music = await serviceMusica.atualizaMusica(req.params.id, music_info);
        res.status(success.SUCCESS);
        res.json(music);
    } catch (error) {
        next(error);
    }
});

// Adiciona uma nova música
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_info: Prisma.MusicaCreateInput = {
            nome: req.body.nome,
            album: req.body.album,
            genero: req.body.genero,
        };
        const music = await serviceMusica.criarMusica(user_info);
        res.status(success.CREATED);
        res.json(music);
    } catch (error) {
        next(error);
    }
});



export default router;
