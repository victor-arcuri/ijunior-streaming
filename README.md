# Streaming de Músicas: Modelagem e CRUD com Prisma 🎵

## Introdução 🚩
A atividade consiste na modelagem de um banco de dados que simule um serviço de streaming de músicas, e na criação de uma API no modelo MVC para consultar o banco, permitindo realização das operações CRUD sobre suas entidades.

## Orientações 🗒️

### Semana 05
O projeto se inicia na semana 05, a partir da modelagem do banco e início da criação da API, com apenas services para opereações básicas de CRUD. 

Suas orientações podem ser encontradas no Notion com mais detalhes [nesse link](https://www.notion.so/ijunior/Atividade-M-os-obra-23dc39c4674680e49aa1c6099ff31c9f).

#### Objetivos 
- [X] Criar e configurar o repositório do projeto
- [X] Inicializar a estrutura do prisma 
- [X] Modelar o banco de dados 
- [ ] Criar as schemas referentes às entidades do banco
- [ ] Criar o início da arquitetura MVC (services) 
- [ ] Criar as services de CRUD referentes às entidades
- [ ] Atualizar a documentação do repositório

## Modelagem do Banco 📝
O banco de dados retrata três entidades principais e suas relações:

![Diagrama representando as relações das tabelas do banco de dados](/public/imgs/db_schema.png)

### Entidades

#### Usuário
O usuário é aquele que irá interagir diretamente com a plataforma e utilizar seus recursos.

Como elementos principais, possui:

- **id**: representa seu identificador único na tabela
- **email**: email único registrado por cada usuário
- **nome**: nome do usuário
- **privilegio**: nível de acesso aos recursos da plataforma, podendo ser (PADRAO, ASSINANTE ou DEV)
- **senha**: senha para acessar a conta do usuário
- **foto**: url para a foto de perfil do usuário

#### Artista
O artista é aquele que lança as músicas. Seu perfil é representativo, e não é acessado diretamente por um usuário, apenas servindo para agrupar suas músicas.

Como elementos principais, possui:

- **id**: representa seu identificador único na tabela
- **nome**: nome artístico
- **streams**: número de vezes que escutaram suas músicas
- **foto**: url para foto de perfil do artista

#### Música
A música é o centro do serviço, sendo lançada sob autoria dos artistas e podendo ser salva pelos usuários e também escutada por eles

Como elementos principais, possui:

- **id**: representa seu identificador único na tabela
- **nome**: nome da música
- **genero**: o gênero musical da publicação
- **album**: sob qual album, se não for um single, a música foi lançada

### Relações

#### Autoria
A tabela de autoria representa a relação entre uma música e um (ou mais) artistas, sendo caracterizada por quem publicou uma música. (1->N)

#### Logs
Os logs representam quando um usuário ouviu uma música, guardando o momento no tempo exato em que isso ocorreu. É uma relação de uma música para um usuário (1->1)

#### Músicas Salvas
Representa as músicas favoritadas por um usuário, retendo a informação de quando foi salva. É uma relação de uma música para um usuário (1->1)


## Como Contribuir 🚀
Inicialmente, solicite permisões de colaboração ao administrador do repositório.

Em seguida, clone o repositório localmente por meio de:
```
git clone https://github.com/victor-arcuri/ijunior-streaming
cd ijunior-streaming
```

Mude para a branch de desenvolvimento
```
git checkout develop
```

A partir daí, sempre que for fazer alguma mudança no código, como, por exemplo, adicionar uma feature, inicie uma nova branch para aquela feature
```
git checkout -b feature/nova-feat-de-exemplo
```

Faça os commits no padrão gitflow, por exemplo:

```
git commit -m "feat: para adicionar nova feature"
git commit -m "docs: para atualizar a documentação"
git commit -m "fix: para correção de erros"
```

Ao final, faça os pushes e crie o pull request para a branch *develop* no GitHub
```
git push
```
> [!TIP]
> Lembre de utilizar *git pull* constantemente na branch *develop* para estar sempre de acordo com a equipe!



