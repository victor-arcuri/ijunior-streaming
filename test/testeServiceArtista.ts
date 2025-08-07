import ServiceArtista from '../src/domains/Artista/services/serviceArtista.js';
import { Prisma } from '@prisma/client';

class TesteDaServiceDeArtista {
    // Insere um artista no banco de dados
    async test_create() {
        try {
            const artistaData: Prisma.ArtistaCreateInput = {
                nome: 'Artista Teste',
                foto: null,
                streams: 0,
            };
            const artista = await ServiceArtista.criarArtista(artistaData);
            console.log(artista);
        } catch (e) {
            console.error(e);
        }
    }

    // Deleta um artista do banco de dados
    async test_delete(id: string) {
        try {
            await ServiceArtista.deletarArtista(id);
            console.log('Artista deletado com sucesso!');
        } catch (e) {
            console.error(e);
        }
    }

    // Atualiza um artista do banco de dados
    async test_update(id: string) {
        try {
            const artistaData: Prisma.ArtistaUpdateInput = {
                nome: 'Artista Teste Atualizado',
                foto: 'nova_foto.jpg',
                streams: 1000,
            };
            await ServiceArtista.atualizaArtista(id, artistaData);
            console.log('Artista atualizado com sucesso!');
        } catch (e) {
            console.log(e);
        }
    }

    // Lista os artistas do banco de dados
    async test_read() {
        try {
            const artistas = await ServiceArtista.listarArtistas();
            console.log(artistas);
        } catch (e) {
            console.error(e);
        }
    }

    // Retorna o artista do banco de dados por id
    async test_read_id(id: string) {
        try {
            const artista = await ServiceArtista.listarArtistaID(id);
            console.log(artista);
        } catch (e) {
            console.error(e);
        }
    }

    // Lista músicas do artista
    async test_musicas(id: string) {
        try {
            const musicas = await ServiceArtista.listaMusicasArtista(id);
            console.log(JSON.stringify(musicas, null, 2));
        } catch (e) {
            console.error(e);
        }
    }
}

// Para testar, descomente as linhas abaixo e substitua os IDs pelos reais do seu banco
// const teste = new TesteDaServiceDeArtista();
// teste.test_create();
// teste.test_read();
