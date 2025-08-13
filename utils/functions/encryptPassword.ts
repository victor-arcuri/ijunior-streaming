import bcrypt from 'bcrypt';
export async function encryptPassword(password: string) {
    const saltRounds = 10;
    const encrypted = bcrypt.hash(password, saltRounds);
    return encrypted;
}
