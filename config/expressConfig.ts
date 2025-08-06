import express, { Express } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import routerUsuario from '../src/domains/Usuario/controllers/controllerUsuario';
import routerArtista from '../src/domains/Artista/controllers/controllerArtista';
import routerMusica from '../src/domains/Musica/controllers/controllerMusica';

dotenv.config();

export const app: Express = express();

const options: CorsOptions = {
    credentials: true,
    origin: process.env.APP_URL,
};

app.use(cors(options));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use('/api/users', routerUsuario);
app.use('/api/artists', routerArtista);
app.use('/api/songs', routerMusica);
