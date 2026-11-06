import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useApi } from '../hooks/useApi.js';
import { useCarrinho } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { nomeCategoria } from '../categorias.js';
import { formatarPreco } from '../utils/formatar.js';
import { MAX_POR_ITEM } from '../utils/carrinho.js';
import Estado from '../components/Estado.jsx';
import SeletorQuantidade from '../components/SeletorQuantidade.jsx';

export default function Produto() {
  const { slug } = useParams();
  const { dados: produto, erro, carregando } = useApi(() => api.produto(slug), [slug]);
  const { adicionar } = useCarrinho();
  const avisar = useToast();
  const [quantidade, setQuantidade] = useState(1);

  if (carregando) return <Estado tipo="carregando" />;
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
        <div className="produto__imagem">
          <img src={produto.imagem} alt={produto.nome} />
        </div>
        <div className="produto__info">
          <span className="cartao-produto__marca">{produto.marca}</span>
          <h1>{produto.nome}</h1>
          <p className="produto__descricao">{produto.descricao}</p>
          <p className="preco preco--grande">{formatarPreco(produto.preco_centavos)}</p>
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
