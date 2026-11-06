import { Link } from 'react-router-dom';
import Estado from '../components/Estado.jsx';

export default function NaoEncontrada() {
  return (
    <div className="container">
      <Estado mensagem="Página não encontrada.">
        <Link className="botao botao--primario" to="/">
          Voltar à loja
        </Link>
      </Estado>
    </div>
  );
}
