import { prismaMock } from '../../../../config/singleton.js';
import serviceArtista from './serviceArtista.js';

describe('criarArtista', () => {
    test('Cria artista => artista criado', async () => {
        const artista = {
            id: '1',
            nome: 'Shaolin',
            streams: 2,
            foto: 'www.com',
        };
        prismaMock.artista.create.mockResolvedValue(artista);

        await expect(serviceArtista.criarArtista(artista)).resolves.toEqual(artista);
    });

    test('Deleta artista', async () => {
        const id = 'abcd';
        serviceArtista.deletarArtista(id);
        expect(prismaMock.artista.delete).toHaveBeenCalledWith({ where: { id } });
    });

    test('Lista artistas', async () => {
        const artistas = [
            {
                id: '1',
                nome: 'Shaolin',
                streams: 2,
                foto: 'www.com',
            },
            {
                id: '2',
                nome: 'Pedro',
                streams: 1000,
                foto: 'www.com',
            },
        ];

        prismaMock.artista.findMany.mockResolvedValue(artistas);
        await expect(serviceArtista.listarArtistas()).resolves.toEqual(artistas);
    });

    test('Retorna um único artista pelo id', async () => {
        const artista = {
            id: '10',
            nome: 'Fedor',
            streams: 99,
            foto: 'www.com',
        };
        prismaMock.artista.findUnique.mockResolvedValue(artista);
        const resolved = await serviceArtista.listarArtistaID('10');
        expect(prismaMock.artista.findUnique).toHaveBeenCalledWith({ where: { id: '10' } });
        expect(resolved).toEqual(artista);
    });

    test('Atualiza artista', async () => {
        const artistaArg = {
            nome: 'Joao',
            streams: 140,
            foto: 'www.com',
        };
        const artistaReturn = {
            id: '65',
            nome: 'Joao',
            streams: 140,
            foto: 'www.com',
        };
        prismaMock.artista.update.mockResolvedValue(artistaReturn);
        const resolved = await serviceArtista.atualizaArtista('65', artistaArg);
        expect(prismaMock.artista.update).toHaveBeenCalledWith({
            data: artistaArg,
            where: { id: '65' },
        });
        expect(resolved).toEqual(artistaReturn);
    });

    test('Lista as músicas do artista', async () => {
        const musicasAutoria = [
            {
                musica: {
                    id: '4',
                    nome: '1234',
                    genero: 'Cowboy',
                    album: 'Adidas',
                },
            },
            {
                musica: {
                    id: '6',
                    nome: 'abcd',
                    genero: 'Country',
                    album: 'flipflop',
                },
            },
        ];
        (prismaMock.autoria.findMany as unknown as jest.Mock).mockResolvedValue(musicasAutoria);
        const result = await serviceArtista.listaMusicasArtista('43');
        expect(prismaMock.autoria.findMany).toHaveBeenCalledWith({
            select: { musica: { select: { album: true, genero: true, id: true, nome: true } } },
            where: { artistaId: '43' },
        });
        expect(result).toEqual(musicasAutoria);
    });
});
