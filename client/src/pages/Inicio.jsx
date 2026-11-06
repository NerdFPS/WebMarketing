import { api } from '../api.js';
import { useApi } from '../hooks/useApi.js';
import Capa from '../components/inicio/Capa.jsx';
import Setores from '../components/inicio/Setores.jsx';
import ListasProntas from '../components/inicio/ListasProntas.jsx';
import ComoFunciona from '../components/inicio/ComoFunciona.jsx';
import CartaEquipe from '../components/inicio/CartaEquipe.jsx';
import Estado from '../components/Estado.jsx';

export default function Inicio() {
  const { dados: produtos, erro } = useApi(() => api.produtos({ ordenar: 'nome' }), []);

  return (
    <>
      <Capa produtos={produtos} />
      {erro && (
        <div className="container">
          <Estado tipo="erro" mensagem={erro.message} />
        </div>
      )}
      <Setores produtos={produtos} />
      <ListasProntas produtos={produtos} />
      <ComoFunciona />
      <CartaEquipe />
    </>
  );
}
