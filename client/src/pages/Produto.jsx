import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useApi } from '../hooks/useApi.js';
import { useCarrinho } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { nomeCategoria } from '../categorias.js';
import { MAX_POR_ITEM } from '../utils/carrinho.js';
import Estado from '../components/Estado.jsx';
import EtiquetaPreco from '../components/EtiquetaPreco.jsx';
import SeletorQuantidade from '../components/SeletorQuantidade.jsx';

export default function Produto() {
  const { slug } = useParams();
  const { dados: produto, erro, carregando } = useApi(() => api.produto(slug), [slug]);
  const { adicionar } = useCarrinho();
  const avisar = useToast();
  const [quantidade, setQuantidade] = useState(1);

  if (carregando) {
    return (
      <div className="container">
        <Estado tipo="carregando" />
      </div>
    );
  }
  if (erro) {
    return (
      <div className="container">
        <Estado tipo="erro" mensagem={erro.message}>
          <Link className="botao" to="/">
            Voltar à loja
          </Link>
        </Estado>
      </div>
    );
  }

  const esgotado = produto.estoque === 0;
  const maximo = Math.min(MAX_POR_ITEM, produto.estoque);

  return (
    <div className="container">
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Início</Link> / <Link to={`/setor/${produto.categoria}`}>{nomeCategoria(produto.categoria)}</Link> /{' '}
        <span>{produto.nome}</span>
      </nav>

      <article className="produto">
        <div className="produto__imagem" data-revelar>
          <img src={produto.imagem} alt={produto.nome} width="560" height="560" />
        </div>
        <div className="produto__info" data-revelar style={{ '--i': 1 }}>
          <h1>{produto.nome}</h1>
          <p className="produto__marca">{produto.marca}</p>
          <p className="produto__descricao">{produto.descricao}</p>
          <EtiquetaPreco centavos={produto.preco_centavos} grande />
          <p className={`estoque ${esgotado ? 'estoque--zero' : ''}`}>
            {esgotado ? 'Produto esgotado' : `${produto.estoque} em estoque`}
          </p>

          {!esgotado && (
            <div className="produto__comprar">
              <SeletorQuantidade valor={quantidade} maximo={maximo} onChange={setQuantidade} />
              <button
                className="botao botao--primario"
                onClick={() => {
                  adicionar(produto, quantidade);
                  avisar(`${quantidade}× ${produto.nome} no carrinho`);
                }}
              >
                Adicionar ao carrinho
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
