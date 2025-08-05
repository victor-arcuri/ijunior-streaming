import express, { Express } from "express";
import { CorsOptions } from "cors";

import dotenv from "dotenv"

dotenv.config()

export const app:  Express = express();

const options: CorsOptions = {
    credentials: true,
    origin: process.env.APP_URL
};