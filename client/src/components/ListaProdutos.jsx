import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { useApi } from '../hooks/useApi.js';
import CartaoProduto from './CartaoProduto.jsx';
import Estado from './Estado.jsx';

const ORDENACOES = [
  { valor: 'nome', rotulo: 'Nome (A–Z)' },
  { valor: 'preco_asc', rotulo: 'Menor preço' },
  { valor: 'preco_desc', rotulo: 'Maior preço' },
];

/** Grade de produtos com seletor de ordenação (guardado na URL). */
export default function ListaProdutos({ titulo, categoria, q, vazio = 'Nenhum produto encontrado.' }) {
  const [params, setParams] = useSearchParams();
  const ordenar = params.get('ordenar') ?? 'nome';

  const { dados: produtos, erro, carregando } = useApi(
    () => api.produtos({ categoria, q, ordenar }),
    [categoria, q, ordenar],
  );

  function mudarOrdem(evento) {
    const novos = new URLSearchParams(params);
    novos.set('ordenar', evento.target.value);
    setParams(novos, { replace: true });
  }

  return (
    <section className="lista-produtos">
      <div className="lista-produtos__topo">
        <h2>{titulo}</h2>
        <label className="ordenar">
          Ordenar por
          <select value={ordenar} onChange={mudarOrdem}>
            {ORDENACOES.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
              </option>
            ))}
          </select>
        </label>
      </div>

      {carregando && <Estado tipo="carregando" />}
      {erro && <Estado tipo="erro" mensagem={erro.message} />}
      {produtos && produtos.length === 0 && <Estado mensagem={vazio} />}
      {produtos && produtos.length > 0 && (
        <div className="grade-produtos">
          {produtos.map((p) => (
            <CartaoProduto key={p.id} produto={p} />
          ))}
        </div>
      )}
    </section>
  );
}
