import { Router } from 'express';
import { CATEGORIAS } from '../seed.js';

const ORDENACOES = {
  preco_asc: 'preco_centavos ASC, nome ASC',
  preco_desc: 'preco_centavos DESC, nome ASC',
  nome: 'nome COLLATE NOCASE ASC',
};

/** Remove acentos e põe em minúsculas, para a busca ignorar "í" vs "i". */
const normalizar = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function rotasProdutos(db) {
  const router = Router();

  router.get('/categorias', (_req, res) => res.json(CATEGORIAS));

  router.get('/produtos', (req, res) => {
    const { categoria, q, ordenar } = req.query;
    // A ordenação vem de uma lista fixa — nunca do texto enviado pelo usuário.
    const ordem = ORDENACOES[ordenar] ?? ORDENACOES.nome;

    let produtos = categoria
      ? db.prepare(`SELECT * FROM produtos WHERE categoria = ? ORDER BY ${ordem}`).all(String(categoria))
      : db.prepare(`SELECT * FROM produtos ORDER BY ${ordem}`).all();

    if (typeof q === 'string' && q.trim()) {
      const termo = normalizar(q.trim());
      produtos = produtos.filter((p) =>
        normalizar(`${p.nome} ${p.marca} ${p.descricao}`).includes(termo),
      );
    }

    res.json(produtos);
  });

  router.get('/produtos/:slug', (req, res) => {
    const produto = db.prepare('SELECT * FROM produtos WHERE slug = ?').get(req.params.slug);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json(produto);
  });

  return router;
}
