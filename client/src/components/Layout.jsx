import { Outlet } from 'react-router-dom';
import Cabecalho from './Cabecalho.jsx';
import Rodape from './Rodape.jsx';

export default function Layout() {
  return (
    <>
      <a className="pular-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo" className="conteudo">
        <Outlet />
      </main>
      <Rodape />
    </>
  );
}
