import CartaEquipe from '../components/inicio/CartaEquipe.jsx';
import { EQUIPE } from '../equipe.js';

export default function Sobre() {
  return (
    <>
      <div className="container">
        <header className="titulo-pagina titulo-pagina--gigante">
          <h1 data-revelar>Quem somos</h1>
          <p data-revelar style={{ '--i': 1 }}>
            Um supermercado online criado como trabalho de conclusão do curso de Informática para Internet: você
            escolhe por setor, monta o carrinho e recebe tudo em casa.
          </p>
        </header>

        <ul className="equipe" aria-label="Nossa equipe" style={{ marginTop: 24, marginBottom: 'var(--secao)' }}>
          {EQUIPE.map((pessoa, i) => (
            <li key={pessoa.nome} className="membro" data-revelar style={{ '--i': i }}>
              <img src={`/images/equipe/${pessoa.foto}`} alt={`Foto de ${pessoa.nome}`} width="400" height="500" loading="lazy" />
              <div>
                <h3>{pessoa.nome}</h3>
                <p>{pessoa.funcao}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <CartaEquipe />
    </>
  );
}
