import { Link } from 'react-router-dom';
import { CATEGORIAS } from '../../categorias.js';
import { useCarrinho } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { formatarPreco } from '../../utils/formatar.js';

/**
 * Os setores como faixas que abrem no lugar (como as placas de corredor),
 * com a palavra "Setores" fixa ao lado enquanto a lista rola.
 */
export default function Setores({ produtos }) {
  const { adicionar } = useCarrinho();
  const avisar = useToast();

  return (
    <section className="setores container" id="setores" aria-labelledby="titulo-setores">
      <div className="setores__grade">
        <div className="setores__fixo">
          <h2 id="titulo-setores" className="palavra-gigante" data-revelar>
            Setores
          </h2>
          <p data-revelar style={{ '--i': 1 }}>
            Quatro corredores, tudo à mão. Abra um setor, veja o preço de cada item e ponha no carrinho sem sair da
            página.
          </p>
        </div>

        <div className="faixas">
          {CATEGORIAS.map((c, i) => {
            const doSetor = produtos?.filter((p) => p.categoria === c.slug) ?? [];
            return (
              <details key={c.slug} className="faixa" open data-revelar style={{ '--i': i }}>
                <summary>
                  <span className="faixa__nome">{c.nome}</span>
                  <span className="faixa__info">
                    <span>
                      {doSetor.length} {doSetor.length === 1 ? 'produto' : 'produtos'}
                    </span>
                    <span className="faixa__mais" aria-hidden="true">
                      <span>+</span>
                    </span>
                  </span>
                </summary>
                <ul className="faixa__itens">
                  <li>
                    <Link className="link" to={`/setor/${c.slug}`}>
                      Abrir o setor de {c.nome.toLowerCase()}
                    </Link>
                  </li>
                  {doSetor.map((p) => (
                    <li key={p.id} className="item-faixa">
                      <img src={p.imagem} alt="" width="56" height="56" loading="lazy" />
                      <Link to={`/produto/${p.slug}`}>{p.nome}</Link>
                      <span className="item-faixa__preco">{formatarPreco(p.preco_centavos)}</span>
                      <button
                        className="mais-carrinho"
                        aria-label={`Adicionar ${p.nome} ao carrinho`}
                        disabled={p.estoque === 0}
                        onClick={() => {
                          adicionar(p);
                          avisar(`${p.nome} no carrinho`);
                        }}
                      >
                        +
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
