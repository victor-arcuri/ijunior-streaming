import express, { Express } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import routerUsuario from '../src/domains/Usuario/controllers/controllerUsuario.js';
import routerArtista from '../src/domains/Artista/controllers/controllerArtista.js';
import routerMusica from '../src/domains/Musica/controllers/controllerMusica.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';

dotenv.config();

export const app: Express = express();

const options: CorsOptions = {
    credentials: true,
    origin: process.env.APP_URL,
};

app.use(cors(options));
app.use(cookieParser());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use('/api/usuarios', routerUsuario);
app.use('/api/artistas', routerArtista);
app.use('/api/musicas', routerMusica);

app.use(errorHandler);
