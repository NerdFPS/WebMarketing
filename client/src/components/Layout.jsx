import { Outlet, useLocation } from 'react-router-dom';
import Cabecalho from './Cabecalho.jsx';
import Rodape from './Rodape.jsx';
import { useRevelar } from '../hooks/useRevelar.js';

export default function Layout() {
  const { pathname } = useLocation();
  useRevelar(pathname);

  return (
    <>
      <a className="pular-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo" className={`conteudo ${pathname === '/' ? 'conteudo--inicio' : ''}`}>
        <Outlet />
      </main>
      <Rodape />
    </>
  );
}
