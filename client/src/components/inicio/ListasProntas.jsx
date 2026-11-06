import { useCarrinho } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { formatarPreco } from '../../utils/formatar.js';

/** Listas de compras prontas: cada uma vira um cupom que vai inteiro ao carrinho. */
export const LISTAS = [
  {
    nome: 'Café da manhã',
    para: 'Para a semana toda',
    itens: [
      ['leite', 2],
      ['nescau', 1],
      ['danone', 1],
    ],
  },
  {
    nome: 'Faxina de sábado',
    para: 'Casa limpa em uma tarde',
    itens: [
      ['rodo-giratorio', 1],
      ['desentupidor-de-pia', 1],
    ],
  },
  {
    nome: 'Banho',
    para: 'Para a família',
    itens: [
      ['sabonete', 4],
      ['shampoo', 1],
    ],
  },
  {
    nome: 'Noite de TCC',
    para: 'Para entregar o trabalho',
    itens: [
      ['monster-white', 3],
      ['nescau', 1],
      ['leite', 1],
    ],
  },
];

export default function ListasProntas({ produtos }) {
  const { adicionar } = useCarrinho();
  const avisar = useToast();
  if (!produtos) return null;

  const montadas = LISTAS.map((lista) => {
    const linhas = lista.itens
      .map(([slug, quantidade]) => ({ produto: produtos.find((p) => p.slug === slug), quantidade }))
      .filter((l) => l.produto);
    const total = linhas.reduce((s, l) => s + l.produto.preco_centavos * l.quantidade, 0);
    return { ...lista, linhas, total };
  });

  function porNoCarrinho(lista) {
    lista.linhas.forEach((l) => adicionar(l.produto, l.quantidade));
    avisar(`Lista “${lista.nome}” no carrinho`);
  }

  return (
    <section className="listas" aria-labelledby="titulo-listas">
      <div className="container">
        <div className="listas__texto">
          <h2 id="titulo-listas" data-revelar>
            Listas prontas
          </h2>
          <p data-revelar style={{ '--i': 1 }}>
            Sem tempo? Ponha uma lista inteira no carrinho com um clique.
          </p>
        </div>

        <div className="cupons">
          {montadas.map((lista, i) => (
            <article key={lista.nome} className="cupom" data-revelar style={{ '--i': i }}>
              <h3 className="cupom__titulo">{lista.nome}</h3>
              <p className="cupom__sub">{lista.para}</p>
              {lista.linhas.map(({ produto, quantidade }) => (
                <p key={produto.id} className="cupom__linha">
                  <span>
                    {quantidade}× {produto.nome}
                  </span>
                  <span className="pontilhado" aria-hidden="true" />
                  <span>{formatarPreco(produto.preco_centavos * quantidade)}</span>
                </p>
              ))}
              <p className="cupom__total">
                <span>Total</span>
                <strong>{formatarPreco(lista.total)}</strong>
              </p>
              <button className="botao botao--largo" onClick={() => porNoCarrinho(lista)}>
                Pôr a lista no carrinho
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
