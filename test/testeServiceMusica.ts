import { PrismaClient } from '@prisma/client';
import {
  criarMusica,
  vincularArtista,
  listarMusicas,
  buscarMusicaPorId,
  atualizarMusica,
  deletarMusica,
  listarMusicasDoArtista
}from '../src/services/serviceMusica';

const prisma = new PrismaClient();

class TesteDaServiceDeMusica {
  private musicaId: string = '';
  private artistaId: string = '';

  async setup() {
    const artista = await prisma.artista.create({
      data: { nome: 'Artista de Teste', foto: null } 
    });
    this.artistaId = artista.id;
  }

  async cleanup() {
    await prisma.$transaction([
      prisma.autoria.deleteMany(),
      prisma.musicaSalva.deleteMany(),
      prisma.logMusica.deleteMany(),
      prisma.musica.deleteMany(),
      prisma.artista.deleteMany(),
    ]);
    await prisma.$disconnect();
  }

  async test_create() {
    const musica = await criarMusica('Música Teste', 'ROCK', 'Álbum Teste');
    this.musicaId = musica.id;
    console.log('Música criada:', musica);
    return musica;
  }

  async test_vincularArtista() {
    const resultado = await vincularArtista(this.musicaId, this.artistaId);
    console.log('Artista vinculado:', resultado);
    return resultado;
  }

  async test_listar() {
    const musicas = await listarMusicas();
    console.log('Músicas encontradas:', JSON.stringify(musicas, null, 2));
    return musicas;
  }

  async test_buscarPorId() {
    const musica = await buscarMusicaPorId(this.musicaId);
    console.log('Música encontrada por ID:', musica);
    return musica;
  }

  async test_atualizar() {
    const atualizada = await atualizarMusica(this.musicaId, { 
      genero: 'POP',
      album: 'Álbum Atualizado'
    });
    console.log('Música atualizada:', atualizada);
    return atualizada;
  }

  async test_listarPorArtista() {
    const musicas = await listarMusicasDoArtista(this.artistaId);
    console.log('Músicas do artista:', JSON.stringify(musicas, null, 2));
    return musicas;
  }

  async test_deletar() {
    await deletarMusica(this.musicaId);
    console.log('Música deletada com sucesso');
  }
}

(async () => {
  const tester = new TesteDaServiceDeMusica();
  
  try {
    console.log('=== INICIANDO TESTES ===');
    await tester.setup();
    
    console.log('\n=== TESTE DE CRIAÇÃO ===');
    const musica = await tester.test_create();
    
    console.log('\n=== TESTE DE VINCULAÇÃO ===');
    await tester.test_vincularArtista();
    
    console.log('\n=== TESTE DE LISTAGEM ===');
    await tester.test_listar();
    
    console.log('\n=== TESTE DE BUSCA POR ID ===');
    await tester.test_buscarPorId();
    
    console.log('\n=== TESTE DE ATUALIZAÇÃO ===');
    await tester.test_atualizar();
    
    console.log('\n=== TESTE DE MÚSICAS POR ARTISTA ===');
    await tester.test_listarPorArtista();
    
    console.log('\n=== TESTE DE EXCLUSÃO ===');
    await tester.test_deletar();
    
    console.log('\n=== TESTES CONCLUÍDOS COM SUCESSO ===');
  } catch (e) {
    console.error('\n=== ERRO DURANTE OS TESTES ===', e);
  } finally {
    await tester.cleanup();
  }
})();
