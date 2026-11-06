import { Router } from 'express';
import { exigirLogin } from '../auth.js';
import { transacao } from '../db.js';
import { FORMAS_PAGAMENTO } from '../validacao.js';

const MAX_POR_ITEM = 10;

class ErroPedido extends Error {}

export function rotasPedidos(db) {
  const router = Router();

  router.get('/pedidos', exigirLogin, (req, res) => {
    const pedidos = db
      .prepare('SELECT * FROM pedidos WHERE cliente_id = ? ORDER BY id DESC')
      .all(req.cliente.id);
    const itens = db.prepare('SELECT * FROM itens_pedido WHERE pedido_id = ?');
    res.json(pedidos.map((p) => ({ ...p, itens: itens.all(p.id) })));
  });

  router.post('/pedidos', exigirLogin, (req, res) => {
    const { itens, formaPagamento } = req.body ?? {};

    if (!FORMAS_PAGAMENTO.includes(formaPagamento)) {
      return res.status(400).json({ erro: 'Escolha uma forma de pagamento válida.' });
    }
    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: 'O carrinho está vazio.' });
    }

    // Junta itens repetidos e valida as quantidades.
    const quantidades = new Map();
    for (const item of itens) {
      const id = Number(item?.produtoId);
      const qtd = Number(item?.quantidade);
      if (!Number.isInteger(id) || !Number.isInteger(qtd) || qtd < 1) {
        return res.status(400).json({ erro: 'Item do carrinho inválido.' });
      }
      quantidades.set(id, (quantidades.get(id) ?? 0) + qtd);
    }
    for (const qtd of quantidades.values()) {
      if (qtd > MAX_POR_ITEM) {
        return res.status(400).json({ erro: `Máximo de ${MAX_POR_ITEM} unidades por produto.` });
      }
    }

    const buscarProduto = db.prepare('SELECT id, nome, preco_centavos, estoque FROM produtos WHERE id = ?');
    const baixarEstoque = db.prepare('UPDATE produtos SET estoque = estoque - ? WHERE id = ? AND estoque >= ?');
    const inserirPedido = db.prepare(
      'INSERT INTO pedidos (cliente_id, forma_pagamento, total_centavos) VALUES (?, ?, ?)',
    );
    const inserirItem = db.prepare(
      'INSERT INTO itens_pedido (pedido_id, produto_id, nome, preco_centavos, quantidade) VALUES (?, ?, ?, ?, ?)',
    );

    try {
      const pedidoId = transacao(db, () => {
        // O preço sempre vem do banco — nunca do navegador.
        const linhas = [...quantidades].map(([id, quantidade]) => {
          const produto = buscarProduto.get(id);
          if (!produto) throw new ErroPedido('Um dos produtos não existe mais.');
          const { changes } = baixarEstoque.run(quantidade, id, quantidade);
          if (changes === 0) throw new ErroPedido(`Estoque insuficiente para "${produto.nome}".`);
          return { ...produto, quantidade };
        });

        const total = linhas.reduce((soma, l) => soma + l.preco_centavos * l.quantidade, 0);
        const { lastInsertRowid } = inserirPedido.run(req.cliente.id, formaPagamento, total);
        for (const l of linhas) inserirItem.run(lastInsertRowid, l.id, l.nome, l.preco_centavos, l.quantidade);
        return Number(lastInsertRowid);
      });

      const pedido = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(pedidoId);
      pedido.itens = db.prepare('SELECT * FROM itens_pedido WHERE pedido_id = ?').all(pedidoId);
      res.status(201).json(pedido);
    } catch (erro) {
      if (erro instanceof ErroPedido) return res.status(409).json({ erro: erro.message });
      throw erro;
    }
  });

  return router;
}
