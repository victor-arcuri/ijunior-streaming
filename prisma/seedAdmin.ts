import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const admin: Prisma.UsuarioCreateInput = {
    email: process.env.ADMIN_EMAIL || '',
    nome: 'Admin',
    senha: await bcrypt.hash(process.env.ADMIN_SENHA || '', 10),
    privilegio: 'ADMIN',
};

try {
    await prisma.usuario.create({ data: admin });
    console.log('Admin criado');
} catch {
    console.log('Admin já existe');
}

await prisma.$disconnect();
