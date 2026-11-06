import { Link } from 'react-router-dom';
import { CATEGORIAS } from '../categorias.js';

/** O verso do encarte: despedida, links e créditos. */
export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="container">
        <div className="verso">
          <div className="verso__grade">
            <div className="verso__despedida">
              <h2>Boas compras.</h2>
              <p>
                O Web Market é o supermercado do bairro dentro do seu celular. Escolha com calma; a gente separa e leva
                até você.
              </p>
            </div>
            <nav aria-label="Setores">
              <h3>Setores</h3>
              <ul>
                {CATEGORIAS.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/setor/${c.slug}`}>{c.nome}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Sua conta">
              <h3>Sua conta</h3>
              <ul>
                <li>
                  <Link to="/minha-conta">Meus pedidos</Link>
                </li>
                <li>
                  <Link to="/carrinho">Carrinho</Link>
                </li>
                <li>
                  <Link to="/cadastro">Criar conta</Link>
                </li>
                <li>
                  <Link to="/sobre">Quem somos</Link>
                </li>
              </ul>
            </nav>
            <div className="verso__selo">
              <img src="/images/produtos/leite.jpg" alt="" width="84" height="112" loading="lazy" />
            </div>
          </div>

          <div className="verso__pagamento">
            <img src="/images/cartoes.png" alt="Bandeiras aceitas: Elo, Visa, Mastercard, American Express e outras" width="200" height="77" loading="lazy" />
            <p>Pix, boleto ou cartão na entrega.</p>
          </div>

          <div className="verso__imprenta">
            <p>
              © {new Date().getFullYear()} Web Market · Trabalho de conclusão do curso de Informática para Internet ·
              Preços de demonstração.
            </p>
            <p>
              Foto da feira:{' '}
              <a href="https://commons.wikimedia.org/w/index.php?curid=165874722">“Barraca de Frutas”</a>, de Rayelle
              da Silva Freitas, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>, via
              Wikimedia Commons.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
