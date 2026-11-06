import { Link } from 'react-router-dom';
import Banner from '../components/Banner.jsx';
import ListaProdutos from '../components/ListaProdutos.jsx';
import { CATEGORIAS } from '../categorias.js';

export default function Inicio() {
  return (
    <>
      <Banner />
      <div className="container">
        <section className="setores" aria-labelledby="titulo-setores">
          <h2 id="titulo-setores">Compre por setor</h2>
          <div className="setores__grade">
            {CATEGORIAS.map((c) => (
              <Link key={c.slug} to={`/setor/${c.slug}`} className={`setor setor--${c.slug}`}>
                <strong>{c.nome}</strong>
                <span>{c.descricao}</span>
              </Link>
            ))}
          </div>
        </section>
        <ListaProdutos titulo="Todos os produtos" />
      </div>
    </>
  );
}
