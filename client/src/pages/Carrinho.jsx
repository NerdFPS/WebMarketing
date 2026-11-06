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
  const { itens, subtotal, alterar, remover, limpar } = useCarrinho();
  const { cliente } = useAuth();
  const avisar = useToast();
  const navegar = useNavigate();
  const [pagamento, setPagamento] = useState('pix');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  if (itens.length === 0) {
    return (
      <div className="container">
        <Estado mensagem="Seu carrinho está vazio.">
          <Link className="botao botao--primario" to="/">
            Voltar à loja
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
      avisar('Pedido realizado com sucesso!');
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
        <h1>Meu carrinho</h1>
      </header>

      <div className="carrinho">
        <ul className="carrinho__itens">
          {itens.map((item) => (
            <li key={item.id} className="item-carrinho">
              <Link to={`/produto/${item.slug}`} className="item-carrinho__foto">
                <img src={item.imagem} alt="" />
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

        <aside className="resumo" aria-labelledby="titulo-resumo">
          <h2 id="titulo-resumo">Resumo</h2>
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatarPreco(subtotal)}</dd>
            </div>
            <div>
              <dt>Frete</dt>
              <dd>Grátis</dd>
            </div>
            <div className="resumo__total">
              <dt>Total</dt>
              <dd>{formatarPreco(subtotal)}</dd>
            </div>
          </dl>

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
            <p className="alerta alerta--erro" role="alert">
              {erro}
            </p>
          )}

          <button className="botao botao--primario botao--largo" onClick={finalizar} disabled={enviando}>
            {enviando ? 'Enviando…' : cliente ? 'Finalizar pedido' : 'Entrar para finalizar'}
          </button>
          <Link to="/" className="resumo__continuar">
            Continuar comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
