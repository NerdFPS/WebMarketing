import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { produtosIniciais } from './seed.js';

const SCHEMA = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS clientes (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    login         TEXT NOT NULL UNIQUE COLLATE NOCASE,
    senha_hash    TEXT NOT NULL,
    nome          TEXT NOT NULL,
    cpf           TEXT NOT NULL UNIQUE,
    cep           TEXT NOT NULL,
    endereco      TEXT NOT NULL,
    celular       TEXT NOT NULL,
    criado_em     TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessoes (
    token_hash    TEXT PRIMARY KEY,
    cliente_id    INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    expira_em     INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS produtos (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    slug          TEXT NOT NULL UNIQUE,
    nome          TEXT NOT NULL,
    descricao     TEXT NOT NULL DEFAULT '',
    marca         TEXT NOT NULL,
    categoria     TEXT NOT NULL,
    preco_centavos INTEGER NOT NULL CHECK (preco_centavos >= 0),
    estoque       INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    imagem        TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pedidos (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id      INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    forma_pagamento TEXT NOT NULL,
    total_centavos  INTEGER NOT NULL,
    status          TEXT NOT NULL DEFAULT 'Recebido',
    criado_em       TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS itens_pedido (
    pedido_id       INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id      INTEGER NOT NULL REFERENCES produtos(id),
    nome            TEXT NOT NULL,
    preco_centavos  INTEGER NOT NULL,
    quantidade      INTEGER NOT NULL CHECK (quantidade > 0),
    PRIMARY KEY (pedido_id, produto_id)
  );

  CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
  CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
`;

/**
 * Abre (ou cria) o banco SQLite, aplica o schema e insere os produtos
 * iniciais quando a tabela está vazia. Use ':memory:' nos testes.
 */
export function abrirBanco(caminho) {
  if (caminho !== ':memory:') mkdirSync(dirname(caminho), { recursive: true });

  const db = new DatabaseSync(caminho);
  db.exec(SCHEMA);

  const { total } = db.prepare('SELECT COUNT(*) AS total FROM produtos').get();
  if (total === 0) {
    const inserir = db.prepare(`
      INSERT INTO produtos (slug, nome, descricao, marca, categoria, preco_centavos, estoque, imagem)
      VALUES (:slug, :nome, :descricao, :marca, :categoria, :preco_centavos, :estoque, :imagem)
    `);
    transacao(db, () => produtosIniciais.forEach((p) => inserir.run(p)));
  }

  return db;
}

/** Executa `fn` dentro de uma transação; desfaz tudo se lançar erro. */
export function transacao(db, fn) {
  db.exec('BEGIN');
  try {
    const resultado = fn();
    db.exec('COMMIT');
    return resultado;
  } catch (erro) {
    db.exec('ROLLBACK');
    throw erro;
  }
}
