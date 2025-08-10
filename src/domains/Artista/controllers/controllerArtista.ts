import { Router, Request, Response, NextFunction } from 'express';
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



export default router;
