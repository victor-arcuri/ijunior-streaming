import { Router, Request, Response, NextFunction } from 'express';
import serviceMusica from '../services/serviceMusica.js';
import { Prisma } from '@prisma/client';
import statusCodes from '../../../../utils/constants/statusCodes.js';
import { validateId } from '../../../middlewares/validateId.js';

const router = Router();

// Lista as músicas
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const music_list = await serviceMusica.listarMusicas();
        res.status(statusCodes.SUCCESS);
        res.json(music_list);
    } catch (error) {
        next(error);
    }
});

// Retoma a música a partir de seu ID
router.get('/id/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const music = await serviceMusica.listarMusicaID(req.params.id);
        res.status(statusCodes.SUCCESS);
        res.json(music);
    } catch (error) {
        next(error);
    }
});

// Deleta a música a partir de seu id
router.delete('/id/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const music = await serviceMusica.deletarMusica(req.params.id);
        res.status(statusCodes.SUCCESS);
        res.json(music);
    } catch (error) {
        next(error);
    }
});

// Atualiza uma música a partir de seu id
router.put('/id/:id', validateId, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const music_info: Prisma.MusicaUpdateInput = {
            nome: req.body.nome,
            album: req.body.album,
            genero: req.body.genero,
        };
        const music = await serviceMusica.atualizaMusica(req.params.id, music_info);
        res.status(statusCodes.SUCCESS);
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
        res.status(statusCodes.CREATED);
        res.json(music);
    } catch (error) {
        next(error);
    }
});

//Vincula um artista à uma música
router.post('/autoria', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vinculo = await serviceMusica.vinculaMusicaArtista(req.body.artista, req.body.musica);
        res.status(statusCodes.CREATED);
        res.json(vinculo);
    } catch (error) {
        next(error);
    }
});

//Desvincula um artista de uma música
router.delete('/autoria', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vinculo_info: Prisma.AutoriaWhereUniqueInput = {
            artistaId_musicaId: {
                artistaId: req.body.artista,
                musicaId: req.body.musica,
            },
        };
        const vinculo = await serviceMusica.desvinculaMusicaArtista(vinculo_info);
        res.status(statusCodes.SUCCESS);
        res.json(vinculo);
    } catch (error) {
        next(error);
    }
});

export default router;
