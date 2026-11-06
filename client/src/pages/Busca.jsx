import { useSearchParams } from 'react-router-dom';
import ListaProdutos from '../components/ListaProdutos.jsx';

export default function Busca() {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';

  return (
    <div className="container">
      <header className="titulo-pagina">
        <h1>{q ? `Busca: ${q}` : 'Busca'}</h1>
      </header>
      <ListaProdutos titulo="Encontrados" q={q} vazio={`Nada encontrado para “${q}”. Tente outra palavra ou navegue pelos setores.`} />
    </div>
  );
}
