import { useParams } from 'react-router-dom';
import ListaProdutos from '../components/ListaProdutos.jsx';
import { CATEGORIAS } from '../categorias.js';
import NaoEncontrada from './NaoEncontrada.jsx';

export default function Setor() {
  const { categoria } = useParams();
  const setor = CATEGORIAS.find((c) => c.slug === categoria);
  if (!setor) return <NaoEncontrada />;

  return (
    <div className="container">
      <header className="titulo-pagina">
        <h1>{setor.nome}</h1>
        <p>{setor.descricao}</p>
      </header>
      <ListaProdutos titulo="Produtos" categoria={setor.slug} vazio="Nenhum produto neste setor por enquanto." />
    </div>
  );
}
