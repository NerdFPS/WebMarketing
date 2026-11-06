import { describe, expect, it } from 'vitest';
import { carrinhoReducer, MAX_POR_ITEM, subtotal, totalItens } from './carrinho.js';
import { formatarPreco, mascaraCelular, mascaraCep, mascaraCpf } from './formatar.js';

const leite = { id: 1, slug: 'leite', nome: 'Leite', preco_centavos: 549, imagem: '/x.jpg', estoque: 10 };
const sabonete = { id: 2, slug: 'sabonete', nome: 'Sabonete', preco_centavos: 349, imagem: '/y.jpg', estoque: 10 };

describe('carrinho', () => {
  it('adiciona, soma repetidos e calcula totais', () => {
    let itens = carrinhoReducer([], { tipo: 'adicionar', produto: leite });
    itens = carrinhoReducer(itens, { tipo: 'adicionar', produto: leite, quantidade: 2 });
    itens = carrinhoReducer(itens, { tipo: 'adicionar', produto: sabonete });

    expect(itens).toHaveLength(2);
    expect(itens[0].quantidade).toBe(3);
    expect(totalItens(itens)).toBe(4);
    expect(subtotal(itens)).toBe(549 * 3 + 349);
  });

  it('limita a quantidade entre 1 e o máximo', () => {
    let itens = carrinhoReducer([], { tipo: 'adicionar', produto: leite, quantidade: 50 });
    expect(itens[0].quantidade).toBe(MAX_POR_ITEM);
    itens = carrinhoReducer(itens, { tipo: 'alterar', id: 1, quantidade: 0 });
    expect(itens[0].quantidade).toBe(1);
  });

  it('remove e limpa', () => {
    let itens = carrinhoReducer([], { tipo: 'adicionar', produto: leite });
    itens = carrinhoReducer(itens, { tipo: 'adicionar', produto: sabonete });
    itens = carrinhoReducer(itens, { tipo: 'remover', id: 1 });
    expect(itens.map((i) => i.id)).toEqual([2]);
    expect(carrinhoReducer(itens, { tipo: 'limpar' })).toEqual([]);
  });

  it('atualiza preços e remove produtos que não existem mais', () => {
    let itens = carrinhoReducer([], { tipo: 'adicionar', produto: leite, quantidade: 2 });
    itens = carrinhoReducer(itens, { tipo: 'adicionar', produto: sabonete });
    itens = carrinhoReducer(itens, { tipo: 'atualizarPrecos', produtos: [{ ...leite, preco_centavos: 600 }] });
    expect(itens).toEqual([{ id: 1, slug: 'leite', nome: 'Leite', preco_centavos: 600, imagem: '/x.jpg', quantidade: 2 }]);
  });

  it('não guarda o estoque no carrinho', () => {
    const [item] = carrinhoReducer([], { tipo: 'adicionar', produto: leite });
    expect(item).not.toHaveProperty('estoque');
  });
});

describe('formatação', () => {
  it('formata preço em reais', () => {
    expect(formatarPreco(1549).replace(/\s/g, ' ')).toBe('R$ 15,49');
  });

  it('aplica máscaras', () => {
    expect(mascaraCpf('52998224725')).toBe('529.982.247-25');
    expect(mascaraCep('12602570')).toBe('12602-570');
    expect(mascaraCelular('12996024269')).toBe('(12) 99602-4269');
    expect(mascaraCelular('1233334444')).toBe('(12) 3333-4444');
    expect(mascaraCpf('529.98')).toBe('529.98');
  });
});
