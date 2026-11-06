import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCarrinho } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { FORMAS_PAGAMENTO, formatarPreco } from '../utils/formatar.js';
import Estado from '../components/Estado.jsx';
import SeletorQuantidade from '../components/SeletorQuantidade.jsx';
import { IconeLixeira } from '../components/Icones.jsx';

export default function Carrinho() {
  const { itens, quantidade, subtotal, alterar, remover, limpar } = useCarrinho();
  const { cliente } = useAuth();
  const avisar = useToast();
  const navegar = useNavigate();
  const [pagamento, setPagamento] = useState('pix');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  if (itens.length === 0) {
    return (
      <div className="container">
        <header className="titulo-pagina">
          <h1>Carrinho</h1>
        </header>
        <Estado mensagem="Seu carrinho está vazio. Que tal começar por uma lista pronta?">
          <Link className="botao botao--primario" to="/">
            Ir às compras
          </Link>
        </Estado>
      </div>
    );
  }

  async function finalizar() {
    if (!cliente) {
      navegar('/entrar', { state: { voltarPara: '/carrinho' } });
      return;
    }
    setEnviando(true);
    setErro('');
    try {
      const pedido = await api.criarPedido(
        itens.map((i) => ({ produtoId: i.id, quantidade: i.quantidade })),
        pagamento,
      );
      limpar();
      avisar('Pedido realizado!');
      navegar(`/pedido/${pedido.id}`, { state: { pedido } });
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="container">
      <header className="titulo-pagina">
        <h1>Carrinho</h1>
        <p>
          {quantidade} {quantidade === 1 ? 'item' : 'itens'} separados para você.
        </p>
      </header>

      <div className="carrinho">
        <ul className="carrinho__itens">
          {itens.map((item, i) => (
            <li key={item.id} className="item-carrinho" data-revelar style={{ '--i': i }}>
              <Link to={`/produto/${item.slug}`} className="item-carrinho__foto" tabIndex={-1} aria-hidden="true">
                <img src={item.imagem} alt="" width="88" height="88" />
              </Link>
              <div className="item-carrinho__nome">
                <Link to={`/produto/${item.slug}`}>{item.nome}</Link>
                <small>{formatarPreco(item.preco_centavos)} cada</small>
              </div>
              <SeletorQuantidade
                valor={item.quantidade}
                onChange={(q) => alterar(item.id, q)}
                rotulo={`Quantidade de ${item.nome}`}
              />
              <strong className="item-carrinho__total">{formatarPreco(item.preco_centavos * item.quantidade)}</strong>
              <button className="botao-icone" aria-label={`Remover ${item.nome}`} onClick={() => remover(item.id)}>
                <IconeLixeira />
              </button>
            </li>
          ))}
        </ul>

        {/* O resumo é o cupom fiscal da compra */}
        <aside className="recibo recibo--carrinho" aria-labelledby="titulo-resumo">
          <div className="recibo__cabeca">
            <img src="/images/logo.png" alt="" width="64" height="48" />
            <strong id="titulo-resumo">Seu cupom</strong>
            <span>Confira antes de finalizar</span>
          </div>

          <h3>Itens</h3>
          {itens.map((item) => (
            <p key={item.id} className="recibo__linha">
              <span>
                {item.quantidade}× {item.nome}
              </span>
              <span className="pontilhado" aria-hidden="true" />
              <span>{formatarPreco(item.preco_centavos * item.quantidade)}</span>
            </p>
          ))}
          <p className="recibo__linha">
            <span>Frete</span>
            <span className="pontilhado" aria-hidden="true" />
            <span>Grátis</span>
          </p>

          <p className="recibo__fim">
            <span>Total</span>
            <strong>{formatarPreco(subtotal)}</strong>
          </p>

          <fieldset className="pagamento">
            <legend>Forma de pagamento</legend>
            {Object.entries(FORMAS_PAGAMENTO).map(([valor, rotulo]) => (
              <label key={valor}>
                <input
                  type="radio"
                  name="pagamento"
                  value={valor}
                  checked={pagamento === valor}
                  onChange={() => setPagamento(valor)}
                />
                {rotulo}
              </label>
            ))}
          </fieldset>

          {erro && (
            <p className="alerta alerta--erro" role="alert" style={{ marginTop: 16 }}>
              {erro}
            </p>
          )}

          <div className="recibo__acoes">
            <button className="botao botao--primario botao--largo" onClick={finalizar} disabled={enviando}>
              {enviando ? 'Enviando…' : cliente ? 'Finalizar pedido' : 'Entrar para finalizar'}
            </button>
            <Link to="/" className="link">
              Continuar comprando
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
