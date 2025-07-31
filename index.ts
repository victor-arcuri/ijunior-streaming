import { Privilegios, Usuario } from '@prisma/client';
import ServiceUsuario from './src/services/serviceUsuario';

class TesteDaServiceDeUsuario {
    // Insere um usuario no banco de dados
    async test_create() {
        try {
            const userData = {
                nome: 'João Bobão',
                senha: '12345',
                email: 'joao.p.feijao@gmail.com',
                foto: null,
                privilegio: Privilegios.PADRAO,
            } as Usuario;
            const user = await ServiceUsuario.criarUsuario(userData);
            console.log(user);
        } catch (e) {
            console.error(e);
        }
    }

    // Deleta um usuario do banco de dados
    async test_delete(id: string) {
        try {
            await ServiceUsuario.deletarUsuario(id);
            console.log('Usuário deletado com sucesso!');
        } catch (e) {
            console.error(e);
        }
    }

    // Atualiza um usuario do banco de dados
    async test_update(id: string) {
        try {
            const userData = {
                nome: 'João Não Bobão',
                senha: '12345',
                email: 'joao.p.feijao@gmail.com',
                foto: null,
                privilegio: Privilegios.PADRAO,
            } as Usuario;
            await ServiceUsuario.atualizaUsuario(id, userData);
            console.log('Usuário atualizado com sucesso!');
        } catch (e) {
            console.log(e);
        }
    }

    // Lista os usuários do banco de dados
    async test_read() {
        try {
            const usuarios = await ServiceUsuario.listarUsuarios();
            console.log(usuarios);
        } catch (e) {
            console.error(e);
        }
    }

    // Retoma o usuário do banco de dados por id
    async test_read_id(id: string) {
        try {
            const usuario = await ServiceUsuario.listarUsuarioID(id);
            console.log(usuario);
        } catch (e) {
            console.error(e);
        }
    }

    // Retoma o usuário do banco de dados por email
    async test_read_email(email: string) {
        try {
            const usuario = await ServiceUsuario.listarUsuarioEmail(email);
            console.log(usuario);
        } catch (e) {
            console.error(e);
        }
    }
}

const teste = new TesteDaServiceDeUsuario();
teste.test_create();
