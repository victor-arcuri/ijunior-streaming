import { faker } from '@faker-js/faker';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

function rand(max: number, min = 0) {
    return Math.floor(Math.random() * (max + 1)) + min;
}

async function seedUsuarios(numUsuarios: number) {
    const emailsUsados: string[] = [];
    const idsUsados: string[] = [];
    const usuarios = Array.from({ length: numUsuarios }, () => {
        let id = faker.string.uuid();
        while (idsUsados.includes(id)) {
            id = faker.string.uuid();
        }
        idsUsados.push(id);

        let email = faker.internet.email();
        while (emailsUsados.includes(email)) {
            email = faker.internet.email();
        }
        emailsUsados.push(email);

        const usuario: Prisma.UsuarioCreateInput = {
            id: id,
            email: faker.internet.email(),
            nome: faker.person.fullName(),
            senha: faker.internet.password(),
            foto: faker.image.avatar(),
            privilegio: faker.helpers.arrayElement(['PADRAO', 'ASSINANTE', 'DEV']),
        };
        return usuario;
    });

    await prisma.usuario.createMany({
        data: usuarios,
    });

    return idsUsados;
}

async function seedMusicas(numMusicas: number) {
    const idsUsados: string[] = [];
    const musicas = Array.from({ length: numMusicas }, () => {
        let id = faker.string.uuid();
        while (idsUsados.includes(id)) {
            id = faker.string.uuid();
        }
        idsUsados.push(id);

        const musica: Prisma.MusicaCreateInput = {
            id: id,
            nome: faker.music.songName(),
            album: faker.music.album(),
            genero: faker.music.genre(),
        };
        return musica;
    });

    await prisma.musica.createMany({
        data: musicas,
    });

    return idsUsados;
}

async function seedArtistas(numArtistas: number) {
    const idsUsados: string[] = [];
    const artistas = Array.from({ length: numArtistas }, () => {
        let idGerado = faker.string.uuid();
        while (idsUsados.includes(idGerado)) {
            idGerado = faker.string.uuid();
        }
        idsUsados.push(idGerado);

        const artista: Prisma.ArtistaCreateInput = {
            id: idGerado,
            nome: faker.music.artist(),
            foto: faker.image.avatar(),
            streams: rand(1000000000),
        };
        return artista;
    });

    await prisma.artista.createMany({
        data: artistas,
    });

    return idsUsados;
}

async function seedAutorias(artistas: string[], musicas: string[]) {
    const listaAutorias: Prisma.AutoriaCreateManyInput[] = [];

    for (const musica of musicas) {
        const indexEscolhidos: number[] = [];

        const numAutoria = rand(1);
        for (let i = 0; i <= numAutoria; i++) {
            let authorIndex = rand(artistas.length - 1);
            while (indexEscolhidos.includes(authorIndex)) {
                authorIndex = rand(artistas.length - 1);
            }
            indexEscolhidos.push(authorIndex);

            const autoria: Prisma.AutoriaCreateManyInput = {
                artistaId: artistas[authorIndex],
                musicaId: musica,
            };
            listaAutorias.push(autoria);
        }
    }

    await prisma.autoria.createMany({
        data: listaAutorias,
    });
}

async function seedLogs(usuarios: string[], musicas: string[]) {
    const listaLogs: Prisma.LogMusicaCreateManyInput[] = [];

    for (const usuario of usuarios) {
        const numLogs = rand(20);
        for (let i = 0; i < numLogs; i++) {
            const musicaIndex = rand(musicas.length - 1);

            const log: Prisma.LogMusicaCreateManyInput = {
                usuarioId: usuario,
                musicaId: musicas[musicaIndex],
            };
            listaLogs.push(log);
        }
    }

    await prisma.logMusica.createMany({
        data: listaLogs,
    });
}

async function seedSalvas(usuarios: string[], musicas: string[]) {
    const listaSalvas: Prisma.MusicaSalvaCreateManyInput[] = [];

    for (const usuario of usuarios) {
        const indexEscolhidos: number[] = [];
        const numSalvas = rand(15);
        for (let i = 0; i < numSalvas; i++) {
            let musicaIndex = rand(musicas.length - 1);
            while (indexEscolhidos.includes(musicaIndex)) {
                musicaIndex = rand(musicas.length - 1);
            }
            indexEscolhidos.push(musicaIndex);

            const salva: Prisma.MusicaSalvaCreateManyInput = {
                usuarioId: usuario,
                musicaId: musicas[musicaIndex],
            };
            listaSalvas.push(salva);
        }
    }

    await prisma.musicaSalva.createMany({
        data: listaSalvas,
    });
}

async function main() {
    await prisma.musica.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.artista.deleteMany();
    await prisma.logMusica.deleteMany();

    const usuarios = await seedUsuarios(1000);
    const artistas = await seedArtistas(150);
    const musicas = await seedMusicas(250);

    await seedAutorias(artistas, musicas);
    await seedLogs(usuarios, musicas);
    await seedSalvas(usuarios, musicas);
}

main();
