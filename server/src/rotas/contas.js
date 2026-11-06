import { Router } from 'express';
import {
  COOKIE_SESSAO,
  conferirSenha,
  criarSessao,
  encerrarSessao,
  exigirLogin,
  hashSenha,
  opcoesCookie,
} from '../auth.js';
import { validarPerfil } from '../validacao.js';
import { criarLimiteTentativas } from '../limiteTentativas.js';

const temErros = (erros) => Object.keys(erros).length > 0;

export function rotasContas(db, { limite = criarLimiteTentativas() } = {}) {
  const router = Router();

  router.post('/auth/cadastro', (req, res) => {
    const { dados, erros } = validarPerfil(req.body ?? {}, { cadastro: true });
    if (temErros(erros)) return res.status(400).json({ erro: 'Verifique os campos destacados.', campos: erros });

    const existente = db
      .prepare('SELECT login, cpf FROM clientes WHERE login = ? OR cpf = ?')
      .get(dados.login, dados.cpf);
    if (existente) {
      const campos = {};
      if (existente.login.toLowerCase() === dados.login.toLowerCase()) campos.login = 'Este login já está em uso.';
      if (existente.cpf === dados.cpf) campos.cpf = 'Já existe uma conta com este CPF.';
      return res.status(409).json({ erro: 'Conta já existente.', campos });
    }

    const { lastInsertRowid } = db
      .prepare(`
        INSERT INTO clientes (login, senha_hash, nome, cpf, cep, endereco, celular)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(dados.login, hashSenha(dados.senha), dados.nome, dados.cpf, dados.cep, dados.endereco, dados.celular);

    res.cookie(COOKIE_SESSAO, criarSessao(db, Number(lastInsertRowid)), opcoesCookie());
    res.status(201).json(buscarCliente(db, lastInsertRowid));
  });

  router.post('/auth/login', (req, res) => {
    const { login, senha } = req.body ?? {};
    if (typeof login !== 'string' || typeof senha !== 'string' || !login || !senha) {
      return res.status(400).json({ erro: 'Informe login e senha.' });
    }

    const chave = `${req.ip}|${login.trim().toLowerCase()}`;
    const espera = limite.bloqueadoPor(chave);
    if (espera > 0) {
      res.set('Retry-After', String(espera));
      return res
        .status(429)
        .json({ erro: `Muitas tentativas. Tente de novo em ${Math.ceil(espera / 60)} minuto(s).` });
    }

    const cliente = db.prepare('SELECT id, senha_hash FROM clientes WHERE login = ?').get(login.trim());
    if (!cliente || !conferirSenha(senha, cliente.senha_hash)) {
      limite.registrarFalha(chave);
      return res.status(401).json({ erro: 'Login ou senha incorretos.' });
    }

    limite.zerar(chave);
    res.cookie(COOKIE_SESSAO, criarSessao(db, cliente.id), opcoesCookie());
    res.json(buscarCliente(db, cliente.id));
  });

  router.post('/auth/logout', (req, res) => {
    encerrarSessao(db, req.cookies?.[COOKIE_SESSAO]);
    res.clearCookie(COOKIE_SESSAO, { path: '/' });
    res.status(204).end();
  });

  // Devolve o cliente logado ou `null` (visitante) — não é erro estar deslogado.
  router.get('/auth/eu', (req, res) => res.json(req.cliente ?? null));

  router.put('/conta', exigirLogin, (req, res) => {
    const { dados, erros } = validarPerfil(req.body ?? {}, { cadastro: false });
    if (temErros(erros)) return res.status(400).json({ erro: 'Verifique os campos destacados.', campos: erros });

    db.prepare('UPDATE clientes SET nome = ?, cep = ?, endereco = ?, celular = ? WHERE id = ?')
      .run(dados.nome, dados.cep, dados.endereco, dados.celular, req.cliente.id);
    res.json(buscarCliente(db, req.cliente.id));
  });

  router.delete('/conta', exigirLogin, (req, res) => {
    // Sessões e pedidos são removidos em cascata (ON DELETE CASCADE).
    db.prepare('DELETE FROM clientes WHERE id = ?').run(req.cliente.id);
    res.clearCookie(COOKIE_SESSAO, { path: '/' });
    res.status(204).end();
  });

  return router;
}

function buscarCliente(db, id) {
  return db
    .prepare('SELECT id, login, nome, cpf, cep, endereco, celular FROM clientes WHERE id = ?')
    .get(id);
}
