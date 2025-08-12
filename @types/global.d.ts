import {Usuario} from '@prisma/client'

declare global {
    namespace Express {
        interface Request {
            usuario: Usuario
        }
    }
    namespace NodeJS{
        interface ProcessEnv{
            APP_URL: string;
            PORT: string;
        }
    }
}