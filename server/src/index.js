import { fileURLToPath } from 'node:url';
import { abrirBanco } from './db.js';
import { criarApp } from './app.js';

const porta = Number(process.env.PORT ?? 3001);
const caminhoBanco = process.env.DB_PATH ?? fileURLToPath(new URL('../data/webmarket.db', import.meta.url));

const db = abrirBanco(caminhoBanco);
const app = criarApp(db);

app.listen(porta, () => {
  console.log(`Web Market API rodando em http://localhost:${porta}`);
});
