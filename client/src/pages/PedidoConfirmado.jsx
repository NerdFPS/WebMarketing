import { Link, useLocation, useParams } from 'react-router-dom';
import { FORMAS_PAGAMENTO, formatarPreco } from '../utils/formatar.js';
import LinhaRecibo from '../components/LinhaRecibo.jsx';

export default function PedidoConfirmado() {
  const { id } = useParams();
  const pedido = useLocation().state?.pedido;

  return (
    <div className="container estreito">
      <header className="titulo-pagina">
        <h1>Pedido nº {id} recebido</h1>
        <p>Obrigado pela compra! Você pode acompanhar o pedido em Minha conta.</p>
      </header>

      {pedido && (
        <div className="recibo" data-revelar>
          <div className="recibo__cabeca">
            <img src="/images/logo.png" alt="" width="64" height="48" />
            <strong>Web Market</strong>
            <span>Pedido nº {pedido.id}</span>
          </div>
          <h3>Itens</h3>
          {pedido.itens.map((i) => (
            <LinhaRecibo key={i.produto_id} rotulo={`${i.quantidade}× ${i.nome}`} valor={formatarPreco(i.preco_centavos * i.quantidade)} />
          ))}
          <LinhaRecibo rotulo="Pagamento" valor={FORMAS_PAGAMENTO[pedido.forma_pagamento]} />
          <p className="recibo__fim">
            <span>Total</span>
            <strong>{formatarPreco(pedido.total_centavos)}</strong>
          </p>
        </div>
      )}

      <div className="confirmacao__acoes">
        <Link className="botao botao--primario" to="/minha-conta">
          Ver meus pedidos
        </Link>
        <Link className="botao botao--claro" to="/">
          Continuar comprando
        </Link>
      </div>
    </div>
  );
}
