import express, { Express } from "express";
import { CorsOptions } from "cors";

export const app:  Express = express();

const options: CorsOptions = {
    credentials: true,
    origin: "localhost:3000"
};