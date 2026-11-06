const ETAPAS = [
  {
    quando: 'No site',
    linhas: [
      ['Escolha nos quatro setores', 'ou use uma lista pronta'],
      ['Ajuste as quantidades', 'até 10 por item'],
    ],
  },
  {
    quando: 'Na finalização',
    linhas: [
      ['Entre ou crie sua conta', 'CEP preenche o endereço'],
      ['Escolha como pagar', 'Pix, boleto ou cartão'],
    ],
  },
  {
    quando: 'Depois',
    linhas: [
      ['Acompanhe em Minha conta', 'pedido e status'],
      ['Receba em casa', 'frete grátis'],
    ],
  },
];

/** Como funciona, impresso como um cupom com a borda serrilhada. */
export default function ComoFunciona() {
  return (
    <section className="como container" aria-labelledby="titulo-como">
      <div className="como__grade">
        <div>
          <h2 id="titulo-como" data-revelar>
            Do carrinho à sua porta
          </h2>
          <p data-revelar style={{ '--i': 1 }}>
            Comprar no Web Market leva poucos minutos. O preço que você vê é o preço que paga, e o estoque é
            conferido na hora em que o pedido é feito.
          </p>
          <img
            className="como__foto"
            src="/images/banners/web-market.png"
            alt="Corredor de supermercado desfocado com o logotipo do Web Market sobre um balcão de madeira"
            width="959"
            height="336"
            loading="lazy"
            data-revelar
            style={{ '--i': 2, objectPosition: '30% 50%' }}
          />
        </div>

        <div className="recibo" data-revelar style={{ '--i': 1 }}>
          <div className="recibo__cabeca">
            <img src="/images/logo.png" alt="" width="64" height="48" />
            <strong>Web Market</strong>
            <span>Roteiro de compra</span>
          </div>
          {ETAPAS.map((etapa) => (
            <div key={etapa.quando}>
              <h3>{etapa.quando}</h3>
              {etapa.linhas.map(([oQue, detalhe]) => (
                <p key={oQue} className="recibo__linha">
                  <span>{oQue}</span>
                  <span className="pontilhado" aria-hidden="true" />
                  <span>{detalhe}</span>
                </p>
              ))}
            </div>
          ))}
          <p className="recibo__fim">
            <span>Suas compras na porta</span>
            <span>Frete grátis</span>
          </p>
        </div>
      </div>
    </section>
  );
}
