import { Router } from 'express';
import MusicController from '../controllers/controllerMusica.js';

const router = Router();
const controller = new MusicController();

// Rotas públicas
router.get('/', controller.listarTodas);
router.get('/:id', controller.buscarPorId);
router.get('/artists/:id', controller.listarArtistas);

// Rotas admin
router.post('/create', ...controller.criar);
router.put('/update/:id', ...controller.atualizar);
router.delete('/delete/:id', ...controller.remover);

export default router;
