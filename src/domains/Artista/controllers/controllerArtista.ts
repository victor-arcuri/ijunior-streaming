import { Router, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import serviceArtista from '../services/serviceArtista.js';
import { success } from '../../../../config/statusCodes.js';


const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artistas = await serviceArtista.listarArtistas()
        res.status(success.SUCCESS).json(artistas)
    } catch (err) {
        next(err)
    }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artista: Prisma.ArtistaCreateInput = {
            nome: req.body.nome,
            streams: req.body.streams,
            foto: req.body.foto
        }
        const artistaCriado = await serviceArtista.criarArtista(artista)
        res.status(success.CREATED).json(artistaCriado)
    } catch (err) {
        next(err)
    }
})

router
    .route('/id/:id')
    .get(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const artista = await serviceArtista.listarArtistaID(req.params.id)
            res.status(success.SUCCESS).json(artista)
        } catch (err) {
            next(err)
        }
    })

    .put(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const artista: Prisma.ArtistaUpdateInput = {
                nome: req.body.nome,
                streams: req.body.streams,
                foto: req.body.foto
            }
            const artistaAtualizado = await serviceArtista.atualizaArtista(req.params.id, artista)
            res.status(success.SUCCESS).json(artistaAtualizado)
        } catch (err) {
            next(err)
        }
    })


router.get('/id/:id/musicas', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const musicas = await serviceArtista.listaMusicasArtista(req.params.id)
        res.status(success.SUCCESS).json(musicas)
    } catch(err) {
        next(err)
    }
})

export default router;
