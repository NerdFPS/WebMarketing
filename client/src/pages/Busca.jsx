import { useSearchParams } from 'react-router-dom';
import ListaProdutos from '../components/ListaProdutos.jsx';

export default function Busca() {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';

  return (
    <div className="container">
      <header className="titulo-pagina">
        <h1>{q ? `Resultados para “${q}”` : 'Busca'}</h1>
      </header>
      <ListaProdutos titulo="Produtos encontrados" q={q} vazio={`Nada encontrado para “${q}”. Tente outra palavra.`} />
    </div>
  );
}
