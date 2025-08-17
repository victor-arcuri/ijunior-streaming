import { Request, Response } from 'express';
import MusicService from '../services/serviceMusica';
import statusCodes from '../../../../config/statusCodes';

export default class MusicController {
  constructor(private service = new MusicService()) {}

  // Lista todas as músicas em ordem alfabética
  async listarTodas(req: Request, res: Response) {
    try {
      const musicas = await this.service.listarTodasOrdenadas();
      res.status(statusCodes.SUCCESS).json(musicas);
    } catch (error) {
      console.error('Erro ao listar músicas:', error);
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Erro ao buscar músicas'
      });
    }
  }

  // Busca uma música específica por ID
  async buscarPorId(req: Request, res: Response) {
    try {
      const musica = await this.service.buscarPorId(req.params.id);
      if (!musica) return res.status(statusCodes.NOT_FOUND).json({ mensagem: 'Música não encontrada' });
      res.status(statusCodes.SUCCESS).json(musica);
    } catch (error) {
      console.error('Erro ao buscar música:', error);
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Erro ao buscar música'
      });
    }
  }

  // Marca música como ouvida pelo usuário
  async marcarComoOuvida(req: Request, res: Response) {
    try {
      // @ts-ignore
      await this.service.marcarComoOuvida(req.user.id, req.params.musicaId);
      res.status(statusCodes.SUCCESS).json({ mensagem: 'Música adicionada ao histórico' });
    } catch (error) {
      console.error('Erro ao marcar música:', error);
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Erro ao marcar música'
      });
    }
  }

  // Cria nova música (apenas admin)
  async criarMusica(req: Request, res: Response) {
    try {
      const novaMusica = await this.service.criarMusica(req.body);
      res.status(statusCodes.CREATED).json({
        mensagem: 'Música criada',
        dados: novaMusica
      });
    } catch (error) {
      console.error('Erro ao criar música:', error);
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Erro ao criar música'
      });
    }
  }

  // Lista músicas ouvidas pelo usuário
  async listarOuvidas(req: Request, res: Response) {
    try {
      // @ts-ignore
      const musicas = await this.service.listarOuvidasPorUsuario(req.user.id);
      res.status(statusCodes.SUCCESS).json(musicas);
    } catch (error) {
      console.error('Erro ao listar histórico:', error);
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Erro ao carregar histórico'
      });
    }
  }

  // Atualiza música (apenas admin)
  async atualizarMusica(req: Request, res: Response) {
    try {
      const musicaAtualizada = await this.service.atualizarMusica(req.params.id, req.body);
      res.status(statusCodes.SUCCESS).json(musicaAtualizada);
    } catch (error) {
      console.error('Erro ao atualizar música:', error);
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Erro ao atualizar música'
      });
    }
  }

  // Remove música (apenas admin)
  async removerMusica(req: Request, res: Response) {
    try {
      await this.service.removerMusica(req.params.id);
      res.status(statusCodes.NO_CONTENT).send();
    } catch (error) {
      console.error('Erro ao remover música:', error);
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        mensagem: 'Erro ao remover música'
      });
    }
  }
}
