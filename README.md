# Projeto Fullstack Web - Pratos (tema do Projeto 1)

Aplicacao SPA para busca e cadastro de pratos, seguindo a mesma tematica de comida usada no Projeto 1. O seed busca imagens reais na API TheMealDB (a Foodish, usada no Projeto 1, foi descontinuada pelo proprietario). React no frontend, Express no backend, MongoDB como banco de dados e Redis para cache e blacklist de tokens.

## Alunos
- Lucas Silva Teixeira - 2465329
- Gabriela Rocha Passotto - 2454351

## Estrutura

```text
.
├── backend
│   ├── server.js
│   └── src
│       ├── config
│       ├── models
│       └── routes
└── frontend
    └── src
        ├── components
        ├── contexts
        ├── pages
        ├── routes
        └── services
```

## Dependencias

- Node.js 20+
- MongoDB
- Redis

## Variaveis de ambiente

Por fins de facilitar a execução, removemos do `.gitignore` as variáveis de ambiente, porém estão listadas: 
`backend/.env`:

```env
PORT=3333
MONGO_URI=mongodb://127.0.0.1:27017/oficinas
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=troque_este_segredo
JWT_EXPIRES_IN=1h
FRONTEND_URL=http://localhost:5173
```

`frontend/.env`

```env
VITE_API_URL=http://localhost:3333
```

## Instalacao

```bash
cd backend
npm install
npm run seed
npm run dev
```

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

## Usuario inicial

O seed cria:

- Email: `professor@example.com`
- Senha: `123456`

## Comandos

Backend:

- `npm run dev`: inicia com Nodemon.
- `npm start`: inicia em modo normal.
- `npm run seed`: cria usuario inicial e pratos de exemplo.

Frontend:

- `npm run dev`: servidor Vite.
- `npm run build`: build de producao com compressao gzip/brotli.
- `npm run preview`: preview do build.

## API REST

- `POST /login`
- `POST /logout`
- `GET /foods`
- `GET /foods/:id`
- `POST /foods`
- `PUT /foods/:id`
- `DELETE /foods/:id`

Todas as rotas protegidas exigem `Authorization: Bearer <token>`.

