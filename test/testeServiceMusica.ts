import ServiceMusica from '../src/domains/Musica/services/serviceMusica.js';
import ServiceArtista from '../src/domains/Artista/services/serviceArtista.js';
import { Prisma } from '@prisma/client';

class TesteDaServiceDeMusica {
    private musicaId: string = '';
    private artistaId: string = '';

    async setup() {
        const artista_info: Prisma.ArtistaCreateInput = {
            nome: 'Artista de Teste',
            foto: null,
        };
        const artista = await ServiceArtista.criarArtista(artista_info);
        this.artistaId = artista.id;
    }

    async test_create() {
        const musica_data: Prisma.MusicaCreateInput = {
            nome: 'Música Teste',
            genero: 'Rock',
            album: 'Álbum Teste',
        };
        const musica = await ServiceMusica.criarMusica(musica_data);
        this.musicaId = musica.id;
        console.log('Música criada:', musica);
        return musica;
    }

    async test_vincularArtista() {
        const autoria = await ServiceMusica.vinculaMusicaArtista(this.musicaId, this.artistaId);
        console.log('Artista e música vinculados:', autoria);
        return autoria;
    }

    async test_listar() {
        const musicas = await ServiceMusica.listarMusicas();
        console.log('Músicas encontradas:', JSON.stringify(musicas, null, 2));
        return musicas;
    }

    async test_buscarPorId() {
        const musica = await ServiceMusica.listarMusicaID(this.musicaId);
        console.log('Música encontrada por ID:', musica);
        return musica;
    }

    async test_atualizar() {
        const musica_data: Prisma.MusicaUpdateInput = {
            genero: 'Pop',
            album: 'Álbum Atualizado',
        };
        const atualizada = await ServiceMusica.atualizaMusica(this.musicaId, musica_data);
        console.log('Música atualizada:', atualizada);
        return atualizada;
    }

    async test_deletar() {
        await ServiceMusica.deletarMusica(this.musicaId);
        console.log('Música deletada com sucesso');
    }
}

(async () => {
    const tester = new TesteDaServiceDeMusica();

    try {
        console.log('=== INICIANDO TESTES ===');
        await tester.setup();

        console.log('\n=== TESTE DE CRIAÇÃO ===');
        await tester.test_create();

        console.log('\n=== TESTE DE VINCULAÇÃO ===');
        await tester.test_vincularArtista();

        console.log('\n=== TESTE DE LISTAGEM ===');
        await tester.test_listar();

        console.log('\n=== TESTE DE BUSCA POR ID ===');
        await tester.test_buscarPorId();

        console.log('\n=== TESTE DE ATUALIZAÇÃO ===');
        await tester.test_atualizar();

        console.log('\n=== TESTE DE EXCLUSÃO ===');
        await tester.test_deletar();

        console.log('\n=== TESTES CONCLUÍDOS COM SUCESSO ===');
    } catch (e) {
        console.error('\n=== ERRO DURANTE OS TESTES ===', e);
    }
})();
