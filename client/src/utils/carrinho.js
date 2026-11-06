export const MAX_POR_ITEM = 10;

const limitar = (qtd) => Math.min(MAX_POR_ITEM, Math.max(1, Math.trunc(qtd) || 1));

/**
 * Reducer do carrinho. Cada item guarda uma cópia dos dados do produto
 * para exibição; o preço final sempre é recalculado pelo servidor.
 */
export function carrinhoReducer(itens, acao) {
  switch (acao.tipo) {
    case 'adicionar': {
      const { produto, quantidade = 1 } = acao;
      const existente = itens.find((i) => i.id === produto.id);
      if (existente) {
        return itens.map((i) =>
          i.id === produto.id ? { ...i, quantidade: limitar(i.quantidade + quantidade) } : i,
        );
      }
      const { id, slug, nome, preco_centavos, imagem } = produto;
      return [...itens, { id, slug, nome, preco_centavos, imagem, quantidade: limitar(quantidade) }];
    }
    case 'alterar':
      return itens.map((i) => (i.id === acao.id ? { ...i, quantidade: limitar(acao.quantidade) } : i));
    case 'remover':
      return itens.filter((i) => i.id !== acao.id);
    case 'limpar':
      return [];
    default:
      return itens;
  }
}

export const totalItens = (itens) => itens.reduce((s, i) => s + i.quantidade, 0);
export const subtotal = (itens) => itens.reduce((s, i) => s + i.preco_centavos * i.quantidade, 0);
