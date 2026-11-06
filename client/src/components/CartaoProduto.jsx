import { Link } from 'react-router-dom';
import { useCarrinho } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatarPreco } from '../utils/formatar.js';

export default function CartaoProduto({ produto }) {
  const { adicionar } = useCarrinho();
  const avisar = useToast();
  const esgotado = produto.estoque === 0;

  function adicionarAoCarrinho() {
    adicionar(produto);
    avisar(`${produto.nome} adicionado ao carrinho`);
  }

  return (
    <article className="cartao-produto">
      <Link to={`/produto/${produto.slug}`} className="cartao-produto__imagem">
        <img src={produto.imagem} alt={produto.nome} loading="lazy" />
      </Link>
      <div className="cartao-produto__corpo">
        <span className="cartao-produto__marca">{produto.marca}</span>
        <h3>
          <Link to={`/produto/${produto.slug}`}>{produto.nome}</Link>
        </h3>
        <p className="preco">{formatarPreco(produto.preco_centavos)}</p>
        <button className="botao botao--primario botao--largo" onClick={adicionarAoCarrinho} disabled={esgotado}>
          {esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
        </button>
      </div>
    </article>
  );
}
