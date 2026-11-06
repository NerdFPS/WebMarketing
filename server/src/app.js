import express from 'express';
import cookieParser from 'cookie-parser';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { carregarCliente } from './auth.js';
import { rotasProdutos } from './rotas/produtos.js';
import { rotasContas } from './rotas/contas.js';
import { rotasPedidos } from './rotas/pedidos.js';

const PASTA_CLIENT = fileURLToPath(new URL('../../client/dist', import.meta.url));

/** Monta a aplicação Express a partir de um banco já aberto. */
export function criarApp(db) {
  const app = express();
  app.disable('x-powered-by');

  app.use(express.json({ limit: '50kb' }));
  app.use(cookieParser());
  app.use(carregarCliente(db));

  // Proteção simples contra CSRF: requisições que alteram dados precisam
  // vir como JSON (formulários de outros sites não conseguem enviar isso).
  app.use('/api', (req, res, next) => {
    const alteraDados = !['GET', 'HEAD', 'OPTIONS'].includes(req.method);
    const temCorpo = Number(req.headers['content-length'] ?? 0) > 0;
    if (alteraDados && temCorpo && !req.is('application/json')) {
      return res.status(415).json({ erro: 'Envie os dados como JSON.' });
    }
    next();
  });

  const api = express.Router();
  api.use(rotasProdutos(db));
  api.use(rotasContas(db));
  api.use(rotasPedidos(db));
  api.use((_req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));
  app.use('/api', api);

  // Em produção, o próprio servidor entrega o React já compilado.
  if (existsSync(PASTA_CLIENT)) {
    app.use(express.static(PASTA_CLIENT));
    // Rotas do React (sem extensão) recebem o index.html; um arquivo que
    // não existe (ex.: /images/x.jpg) recebe 404 de verdade.
    app.get('/{*caminho}', (req, res, next) => {
      if (/\.[a-z0-9]+$/i.test(req.path)) return next();
      res.sendFile(join(PASTA_CLIENT, 'index.html'));
    });
    app.use((_req, res) => res.status(404).send('Arquivo não encontrado.'));
  }

  app.use((erro, _req, res, _next) => {
    if (erro.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido.' });
    console.error(erro);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  });

  return app;
}
