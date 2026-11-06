import { Link } from 'react-router-dom';
import { EQUIPE } from '../../equipe.js';

/** Uma carta da equipe que criou o Web Market, com as fotos ao lado. */
export default function CartaEquipe() {
  return (
    <section className="carta" aria-labelledby="titulo-carta">
      <div className="container carta__grade">
        <div className="carta__folha" data-revelar>
          <h2 id="titulo-carta">Feito por quatro colegas</h2>
          <p>
            O Web Market começou como o nosso trabalho de conclusão do curso de Informática para Internet. A pergunta
            era simples: como seria o mercado do bairro se ele estivesse no celular de todo mundo?
          </p>
          <p>
            Dividimos o trabalho: dois de nós cuidaram do visual, os outros dois do banco de dados, da programação e da
            documentação. A primeira versão foi feita em PHP; esta é a segunda, refeita do zero em React.
          </p>
          <p>
            Cada setor, preço e botão desta página foi pensado para que fazer compra seja tão rápido quanto anotar uma
            lista na geladeira.
          </p>
          <div className="carta__assinatura">
            <strong>Tiago, Sandro, Vitor e Igor</strong>
            <span>Equipe Web Market</span>
          </div>
          <Link className="link" to="/sobre">
            Conheça a equipe
          </Link>
        </div>

        <div className="carta__fotos">
          {EQUIPE.map((pessoa, i) => (
            <img
              key={pessoa.foto}
              src={`/images/equipe/${pessoa.foto}`}
              alt={pessoa.nome}
              width="400"
              height="500"
              loading="lazy"
              data-revelar
              style={{ '--i': i }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
