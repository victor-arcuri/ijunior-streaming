import { Router } from 'express';
import MusicController from '../controllers/controllerMusica';

const router = Router();
const controller = new MusicController();

// Rotas públicas
router.get('/', controller.listarTodas);
router.get('/:id', controller.buscarPorId);

// Rotas autenticadas (usuário comum)
router.post('/:id/ouvir', verifyJWT, controller.marcarComoOuvida);
router.get('/historico/usuario', verifyJWT, controller.historico);

// Rotas admin
router.post('/', ...controller.criar);
router.put('/:id', ...controller.atualizar);
router.delete('/:id', ...controller.remover);
router.post('/:musicaId/artistas/:artistaId', ...controller.vincularArtista);
router.delete('/:musicaId/artistas/:artistaId', ...controller.desvincularArtista);

export default router;
