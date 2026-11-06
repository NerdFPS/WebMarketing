import { Link, useLocation, useParams } from 'react-router-dom';
import { FORMAS_PAGAMENTO, formatarPreco } from '../utils/formatar.js';

export default function PedidoConfirmado() {
  const { id } = useParams();
  const pedido = useLocation().state?.pedido;

  return (
    <div className="container estreito">
      <section className="confirmacao">
        <div className="confirmacao__icone" aria-hidden="true">
          ✓
        </div>
        <h1>Pedido nº {id} recebido!</h1>
        {pedido && (
          <p>
            Total de <strong>{formatarPreco(pedido.total_centavos)}</strong> via{' '}
            {FORMAS_PAGAMENTO[pedido.forma_pagamento]}.
          </p>
        )}
        <p>Você pode acompanhar seus pedidos em Minha conta.</p>
        <div className="confirmacao__acoes">
          <Link className="botao botao--primario" to="/minha-conta">
            Ver meus pedidos
          </Link>
          <Link className="botao" to="/">
            Continuar comprando
          </Link>
        </div>
      </section>
    </div>
  );
}
