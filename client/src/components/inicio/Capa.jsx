import { Link } from 'react-router-dom';
import EtiquetaPreco from '../EtiquetaPreco.jsx';

const OFERTAS = ['leite', 'nescau', 'sabonete'];

/** Primeira tela: a capa do encarte de ofertas, sobre a foto de uma feira. */
export default function Capa({ produtos }) {
  const ofertas = OFERTAS.map((slug) => produtos?.find((p) => p.slug === slug)).filter(Boolean);

  return (
    <section className="capa" aria-labelledby="titulo-capa">
      <img
        className="capa__foto"
        src="/images/feira/feira.jpg"
        alt=""
        width="1600"
        height="1200"
        fetchPriority="high"
      />

      <div className="encarte">
        <div className="encarte__topo">
          <h1 id="titulo-capa" data-revelar>
            Web Market
          </h1>
          <img src="/images/logo.png" alt="" width="120" height="90" />
        </div>

        <div className="encarte__corpo">
          <div>
            <p className="encarte__frase" data-revelar style={{ '--i': 1 }}>
              O supermercado do bairro, com entrega na sua porta.
            </p>
            <ul className="encarte__fatos" data-revelar style={{ '--i': 2 }}>
              <li>Laticínios, alimentícios, utensílios e higiene</li>
              <li>Pix, boleto ou cartão na entrega</li>
              <li>Frete grátis</li>
            </ul>
          </div>

          <div className="encarte__ofertas">
            {ofertas.map((p, i) => (
              <Link key={p.id} to={`/produto/${p.slug}`} className="oferta" data-revelar style={{ '--i': 2 + i }}>
                <img src={p.imagem} alt="" width="200" height="200" />
                <EtiquetaPreco centavos={p.preco_centavos} />
                <span className="oferta__nome">{p.nome}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="encarte__base">
          <span className="encarte__validade">Ofertas válidas enquanto durar o estoque.</span>
          <a className="botao botao--primario" href="#setores">
            Ver todos os produtos
          </a>
          <Link className="link" to="/cadastro">
            Criar conta
          </Link>
        </div>
      </div>
    </section>
  );
}
