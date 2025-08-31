import ServiceUsuario from '../../../../src/services/ServiceUsuario';
import prisma from '../../../../config/prismaClient';
import bcrypt from 'bcrypt';
import { TokenError } from '../../../../errors/TokenError';

jest.mock('../../../../config/prismaClient');
jest.mock('bcrypt');
jest.mock('../../../../errors/TokenError');

describe('ServiceUsuario', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criarUsuario', () => {
    it('deve criar usuário com senha criptografada', async () => {
      const userData = {
        email: 'teste@email.com',
        nome: 'Usuário Teste',
        senha: 'senha1234'
      };

      bcrypt.hash.mockResolvedValue('senha_criptografada');
      
      const usuarioCriado = {
        id: '1',
        email: 'teste@email.com',
        nome: 'Usuário Teste'
      };
      
      prisma.usuario.create.mockResolvedValue(usuarioCriado);

      const resultado = await ServiceUsuario.criarUsuario(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith('senha1234', 10);
      expect(resultado).toEqual(usuarioCriado);
    });
  });

  describe('listarUsuarioID', () => {
    it('deve retornar usuário por ID', async () => {
      const usuarioMock = { 
        id: '1', 
        nome: 'Usuário Teste', 
        email: 'teste@email.com' 
      };
      
      prisma.usuario.findUnique.mockResolvedValue(usuarioMock);

      const resultado = await ServiceUsuario.listarUsuarioID('1');

      expect(resultado).toEqual(usuarioMock);
    });

    it('deve falhar quando usuário não existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);

      await expect(ServiceUsuario.listarUsuarioID('999')).rejects.toThrow(TokenError);
    });
  });

  describe('atualizaUsuario', () => {
    it('deve atualizar usuário e criptografar nova senha', async () => {
      const updateData = {
        nome: 'Novo Nome',
        senha: 'novaSenha123'
      };

      bcrypt.hash.mockResolvedValue('nova_senha_criptografada');
      
      const usuarioAtualizado = { 
        id: '1', 
        nome: 'Novo Nome' 
      };
      
      prisma.usuario.update.mockResolvedValue(usuarioAtualizado);

      const resultado = await ServiceUsuario.atualizaUsuario('1', updateData);

      expect(bcrypt.hash).toHaveBeenCalledWith('novaSenha123', 10);
      expect(resultado).toEqual(usuarioAtualizado);
    });
  });

  describe('métodos de histórico', () => {
    it('deve listar histórico do usuário', async () => {
      const historicoMock = [{
        tempo: new Date(),
        musica: { nome: 'Música Teste' },
        id: '1'
      }];
      
      prisma.logMusica.findMany.mockResolvedValue(historicoMock);

      const resultado = await ServiceUsuario.listaHistoricoUsuario('1');

      expect(resultado).toEqual(historicoMock);
    });

    it('deve salvar música para usuário', async () => {
      const musicaSalvaMock = { id: '1' };
      prisma.musicaSalva.create.mockResolvedValue(musicaSalvaMock);

      const resultado = await ServiceUsuario.salvaMusicaUsuario('1', '100');

      expect(resultado).toEqual(musicaSalvaMock);
    });
  });
});
