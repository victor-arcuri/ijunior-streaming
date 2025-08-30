import { Prisma } from "@prisma/client";
import { prismaMock } from "../../../../config/singleton";
import { TokenError } from '../../../../errors/TokenError.js';
import serviceMusica from "./serviceMusica";

describe('criarMusica', ()=>{
    test('cria musica com dados válidos ==> retorna a música criada', async ()=>{
        const musicaInfo = {
            nome: "Música Genérica",
            genero: "Pop",
            album: "As Mais Genéricas de 2003"
        };

        const musicaCriada = {
            id: "e39d60e0-95ea-472c-90fc-65c656885060",
            ...musicaInfo
        }


        prismaMock.musica.create.mockResolvedValue(musicaCriada);

        await expect(serviceMusica.criarMusica(musicaInfo)).resolves.toEqual(musicaCriada);
    });
});

describe('deletarMusica', ()=>{
    test('deleta música com id válido ==> não retorna erro', async ()=>{
        const musicaDeletada = {
        id: "e39d60e0-95ea-472c-90fc-65c656885060",
        nome: "Música Genérica",
        genero: "Pop",
        album: "As Mais Genéricas de 2003"
        };

        prismaMock.musica.delete.mockResolvedValue(musicaDeletada);

        await expect(serviceMusica.deletarMusica("e39d60e0-95ea-472c-90fc-65c656885060")).resolves.toBeUndefined();

        expect(prismaMock.musica.delete).toHaveBeenCalledWith({
            where: { id: "e39d60e0-95ea-472c-90fc-65c656885060" }
        });
    });

    test('deleta música com id inexistente ==> retorna erro', async ()=>{
        const id = "e39d60e0-95ea-472c-90fc-65c656885060";

        prismaMock.musica.delete.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError(
        "Registro não encontrado",
        { 
            code: "P2025", 
            clientVersion: "5.0.0" 
        }
        ));

        await expect(serviceMusica.deletarMusica(id)).rejects.toThrow("Registro não encontrado");

        expect(prismaMock.musica.delete).toHaveBeenCalledWith({
            where: { id: id }
        });
    });
});

describe('listarMusicas', ()=>{
    test('tenta listar as músicas ==> retorna uma lista com todas as músicas do banco', async ()=>{
        const musicas = [
            {   
                id: "e39d60e0-95ea-472c-90fc-65c656885060",
                nome: "Música Genérica",
                genero: "Pop",
                album: "As Mais Genéricas de 2003",
                autoria: {
                    artista: "42ea83e0-baea-4b66-a64c-ff65ff04b9cb"
                }
            },
            {   
                id: "789d64e0-93ea-412c-10fc-65c656834660",
                nome: "Música Original",
                genero: "Pop",
                album: "As Mais Originais de 2003",
                autoria: {
                    artista: "fb41f781-2dd6-44a0-966d-1dd31ab45c73"
                }
            },
        ];
        prismaMock.musica.findMany.mockResolvedValue(musicas);

        await expect(serviceMusica.listarMusicas()).resolves.toEqual(musicas);
    });

});

describe('listarMusicaID', ()=>{
    test('tenta retomar a música com id válido ==> retoma a música com id válido ', async ()=>{
        const id = "e39d60e0-95ea-472c-90fc-65c656885060";
        const musicaRetomada = {
            id: "e39d60e0-95ea-472c-90fc-65c656885060",
            nome: "Música Genérica",
            genero: "Pop",
            album: "As Mais Genéricas de 2003",
            autoria: {
                artista: "42ea83e0-baea-4b66-a64c-ff65ff04b9cb"
            }
        };
        
        prismaMock.musica.findUnique.mockResolvedValue(musicaRetomada);

        await expect(serviceMusica.listarMusicaID(id)).resolves.toEqual(musicaRetomada);
    });

    test('tenta retomar a música com id inválido ==> lança um erro', async ()=>{
        const id = "e39d60e0-95ea-472c-90fc-65c656885060";

        await expect(serviceMusica.listarMusicaID(id)).rejects.toThrow(
            new TokenError('UUID v4 inválido')
        );
    });
});

describe('atualizaMusica', ()=>{
    test('tenta atualizar a música com id válido e body válido ==> etoma a música atualizada', async ()=>{
        const id = "e39d60e0-95ea-472c-90fc-65c656885060";
        const musicaInfo = {
            nome: "Música Genérica",
            genero: "Rock",
            album: "As Mais Genéricas de 2005"
        };
        const musicaAtualizada = {
            id: id,
            ...musicaInfo
        }
        prismaMock.musica.update.mockResolvedValue(musicaAtualizada);
        
        await expect(serviceMusica.atualizaMusica(id, musicaInfo)).resolves.toEqual(musicaAtualizada);
    });

    test('tenta atualizar a música com id inválido ==> lança um erro', async ()=>{
        const id = "a12d50f0-25ea-152d-90fc-65c656885087";
        const musicaInfo = {
            nome: "Música Genérica",
            genero: "Rock",
            album: "As Mais Genéricas de 2005"
        };

        prismaMock.musica.update.mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError(
                "Registro não encontrado",
                { 
                    code: "P2025", 
                    clientVersion: "5.0.0" 
                }
            )
        );

        await expect(serviceMusica.atualizaMusica(id, musicaInfo)).rejects.toThrow("Registro não encontrado");
    });

    test('tenta atualizar a música com body inválido ==> lança um erro', async ()=>{
        const id = "e39d60e0-95ea-472c-90fc-65c656885060";
        const musicaInfo = {
            genero: undefined,
            album: ""
        };

        await expect(serviceMusica.atualizaMusica(id, musicaInfo)).rejects.toThrow("Update de música inválido");
    });
});

describe('vincularMusicaArtista', ()=>{
    test('tenta vincular musica e artistas válidos ==> retoma relação de autoria', async ()=>{
        const musicaId = "e39d60e0-95ea-472c-90fc-65c656885060";
        const artistaId = "916e84a8-ab4d-4a98-b0fe-4bf55646c425";

        prismaMock.autoria.create.mockResolvedValue({
            artistaId: artistaId,
            musicaId: musicaId
        });
        
        await expect(serviceMusica.vinculaMusicaArtista(artistaId, musicaId)).resolves.toEqual({
            artistaId: artistaId,
            musicaId: musicaId
        });
    });

    test('tenta vincular musica e artista inválidos ==> lança erro', async ()=>{
        const musicaId = "e39d60e0-95ea-472c-90fc-65c656885060";
        const artistaId = "916e84a8-ab4d-4a98-b0fe-4bf55646c425";

        prismaMock.autoria.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError(
        "Registro não encontrado",
        { 
            code: "P2025", 
            clientVersion: "5.0.0" 
        }
        ));
        
        await expect(serviceMusica.vinculaMusicaArtista(artistaId, musicaId)).rejects.toThrow("Registro não encontrado");
    });
});

describe('desvinculaMusicaArtista', ()=>{
    test('tenta desvincular musica e artistas válidos ==> retoma relação de autoria', async ()=>{
        const musicaId = "e39d60e0-95ea-472c-90fc-65c656885060";
        const artistaId = "916e84a8-ab4d-4a98-b0fe-4bf55646c425";

        prismaMock.autoria.delete.mockResolvedValue({
            artistaId: artistaId,
            musicaId: musicaId
        });
        
        await expect(serviceMusica.desvinculaMusicaArtista({artistaId_musicaId:{artistaId:artistaId, musicaId:musicaId}})).resolves.toEqual({
            artistaId: artistaId,
            musicaId: musicaId
        });
    });

    test('tenta desvincular musica e artista inválidos ==> lança erro', async ()=>{
        const musicaId = "e39d60e0-95ea-472c-90fc-65c656885060";
        const artistaId = "916e84a8-ab4d-4a98-b0fe-4bf55646c425";

        prismaMock.autoria.delete.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError(
        "Registro não encontrado",
        { 
            code: "P2025", 
            clientVersion: "5.0.0" 
        }
        ));
        
        await expect(serviceMusica.desvinculaMusicaArtista({artistaId_musicaId:{artistaId:artistaId, musicaId:musicaId}})).rejects.toThrow("Registro não encontrado");
    });


});