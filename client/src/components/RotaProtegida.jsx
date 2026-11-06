import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Estado from './Estado.jsx';

/** Só deixa passar quem está logado; os outros vão para /entrar e voltam depois. */
export default function RotaProtegida() {
  const { cliente, carregando } = useAuth();
  const local = useLocation();

  if (carregando) return <Estado tipo="carregando" />;
  if (!cliente) return <Navigate to="/entrar" replace state={{ voltarPara: local.pathname }} />;
  return <Outlet />;
}
