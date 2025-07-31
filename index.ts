import { Privilegios, Usuario } from "@prisma/client";
import ServiceUsuario from "./src/services/serviceUsuario";

async function main(){
    const userData = {
        nome: "João Bobão",
        senha: "12345",
        email: "joao.p.feijao@gmail.com",
        foto: null,
        privilegio: Privilegios.PADRAO

    } as Usuario
    const user = await ServiceUsuario.criarUsuario(userData);
    console.log(user);

}

main();