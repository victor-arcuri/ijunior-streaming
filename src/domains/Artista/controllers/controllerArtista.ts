import { Router, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import serviceArtista from '../services/serviceArtista.js';
import serviceMusica from '../../Musica/services/serviceMusica.js';
import statusCodes from '../../../../utils/constants/statusCodes.js';
import { validateId } from '../../../middlewares/validateId.js';
import { verifyJWT, checkRole } from '../../../middlewares/auth.js';

const router = Router();

/* 
FUNÇÕES DE ACESSO UNIVERSAL
*/

router.get('/', verifyJWT, checkRole(['ADMIN', 'PADRAO']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artistas = await serviceArtista.listarArtistas();
        res.status(statusCodes.SUCCESS).json(artistas);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', verifyJWT, checkRole(['ADMIN','PADRAO']),validateId, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artista = await serviceArtista.listarArtistaID(req.params.id);
        res.status(statusCodes.SUCCESS).json(artista);
    } catch (err) {
        next(err);
    }
})

/*
    FUNÇÕES DE ACESSO DE ADMIN
*/

router.post('/create', verifyJWT, checkRole(['ADMIN']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artista: Prisma.ArtistaCreateInput = {
            nome: req.body.nome,
            streams: req.body.streams,
            foto: req.body.foto,
        };
        const artistaCriado = await serviceArtista.criarArtista(artista);
        res.status(statusCodes.CREATED).json(artistaCriado);
    } catch (err) {
        next(err);
    }
});

router.post('/update/:id', verifyJWT, checkRole(['ADMIN']), validateId, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const artista: Prisma.ArtistaUpdateInput = {
                nome: req.body.nome,
                streams: req.body.streams,
                foto: req.body.foto,
            };
            const artistaAtualizado = await serviceArtista.atualizaArtista(req.params.id, artista);
            res.status(statusCodes.SUCCESS).json(artistaAtualizado);
        } catch (err) {
            next(err);
        }
})

router.delete('/delete/:id', verifyJWT, checkRole(['ADMIN']), validateId, async (req: Request, res: Response, next: NextFunction) => {
        try {
            await serviceArtista.deletarArtista(req.params.id);
            res.status(statusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
});


router.post('/link/:id', verifyJWT, checkRole(['ADMIN']), validateId, async (req: Request, res: Response, next: NextFunction) => {
        try {
            await serviceMusica.vinculaMusicaArtista(req.params.id, req.body.musica_id);
            res.status(statusCodes.SUCCESS).send();
        } catch (err) {
            next(err);
        }
});

router.post('/unlink/:id', verifyJWT, checkRole(['ADMIN']), validateId, async (req: Request, res: Response, next: NextFunction) => {
        try {
            await serviceMusica.desvinculaMusicaArtista({artistaId_musicaId:{artistaId: req.params.id, musicaId:req.body.musica_id}});
            res.status(statusCodes.SUCCESS).send();
        } catch (err) {
            next(err);
        }
});


export default router;
