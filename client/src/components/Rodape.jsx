import { Link } from 'react-router-dom';
import { CATEGORIAS } from '../categorias.js';

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="container rodape__grade">
        <div>
          <img src="/images/logo.png" alt="Web Market" width="96" height="72" className="rodape__logo" />
          <p>Seu supermercado online. Projeto de conclusão do curso de Informática para Internet.</p>
        </div>
        <div>
          <h2>Setores</h2>
          <ul>
            {CATEGORIAS.map((c) => (
              <li key={c.slug}>
                <Link to={`/setor/${c.slug}`}>{c.nome}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Institucional</h2>
          <ul>
            <li>
              <Link to="/sobre">Quem somos</Link>
            </li>
            <li>
              <Link to="/minha-conta">Minha conta</Link>
            </li>
            <li>
              <Link to="/carrinho">Carrinho</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Formas de pagamento</h2>
          <img src="/images/cartoes.png" alt="Bandeiras de cartão aceitas" className="rodape__cartoes" />
          <p className="rodape__nota">Pix, boleto ou cartão na entrega.</p>
        </div>
      </div>
      <p className="rodape__copy">© {new Date().getFullYear()} Web Market · Ambiente de demonstração</p>
    </footer>
  );
}
