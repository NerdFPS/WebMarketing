import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { carrinhoReducer, subtotal, totalItens } from '../utils/carrinho.js';

const CHAVE = 'webmarket:carrinho';
const CartContext = createContext(null);

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    return Array.isArray(salvo) ? salvo : [];
  } catch {
    return [];
  }
}

/** Carrinho guardado no navegador (localStorage), assim não some ao recarregar. */
export function CartProvider({ children }) {
  const [itens, despachar] = useReducer(carrinhoReducer, undefined, carregar);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(itens));
    } catch {
      // Navegação privada ou armazenamento cheio: o carrinho só não persiste.
    }
  }, [itens]);

  const valor = useMemo(
    () => ({
      itens,
      quantidade: totalItens(itens),
      subtotal: subtotal(itens),
      adicionar: (produto, quantidade = 1) => despachar({ tipo: 'adicionar', produto, quantidade }),
      alterar: (id, quantidade) => despachar({ tipo: 'alterar', id, quantidade }),
      remover: (id) => despachar({ tipo: 'remover', id }),
      limpar: () => despachar({ tipo: 'limpar' }),
      atualizarPrecos: (produtos) => despachar({ tipo: 'atualizarPrecos', produtos }),
    }),
    [itens],
  );

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export const useCarrinho = () => useContext(CartContext);
