import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RotaProtegida from './components/RotaProtegida.jsx';
import Inicio from './pages/Inicio.jsx';
import Setor from './pages/Setor.jsx';
import Busca from './pages/Busca.jsx';
import Produto from './pages/Produto.jsx';
import Carrinho from './pages/Carrinho.jsx';
import Entrar from './pages/Entrar.jsx';
import Cadastro from './pages/Cadastro.jsx';
import MinhaConta from './pages/MinhaConta.jsx';
import PedidoConfirmado from './pages/PedidoConfirmado.jsx';
import Sobre from './pages/Sobre.jsx';
import NaoEncontrada from './pages/NaoEncontrada.jsx';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="setor/:categoria" element={<Setor />} />
        <Route path="busca" element={<Busca />} />
        <Route path="produto/:slug" element={<Produto />} />
        <Route path="carrinho" element={<Carrinho />} />
        <Route path="entrar" element={<Entrar />} />
        <Route path="cadastro" element={<Cadastro />} />
        <Route path="sobre" element={<Sobre />} />
        <Route element={<RotaProtegida />}>
          <Route path="minha-conta" element={<MinhaConta />} />
          <Route path="pedido/:id" element={<PedidoConfirmado />} />
        </Route>
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}
