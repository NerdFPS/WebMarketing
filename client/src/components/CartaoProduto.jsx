import { Link } from 'react-router-dom';
import { useCarrinho } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import EtiquetaPreco from './EtiquetaPreco.jsx';

export default function CartaoProduto({ produto, indice = 0 }) {
  const { adicionar } = useCarrinho();
  const avisar = useToast();
  const esgotado = produto.estoque === 0;

  function adicionarAoCarrinho() {
    adicionar(produto);
    avisar(`${produto.nome} no carrinho`);
  }

  return (
    <article className="cartao-produto" data-revelar style={{ '--i': indice % 4 }}>
      <Link to={`/produto/${produto.slug}`} className="cartao-produto__imagem" tabIndex={-1} aria-hidden="true">
        <img src={produto.imagem} alt="" loading="lazy" width="240" height="240" />
      </Link>
      <EtiquetaPreco centavos={produto.preco_centavos} />
      <div className="cartao-produto__corpo">
        <h3>
          <Link to={`/produto/${produto.slug}`}>{produto.nome}</Link>
        </h3>
        <span className="cartao-produto__marca">{produto.marca}</span>
        <button className="botao botao--largo" onClick={adicionarAoCarrinho} disabled={esgotado}>
          {esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
        </button>
      </div>
    </article>
  );
}
