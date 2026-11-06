import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Campo from '../components/Campo.jsx';

export default function Entrar() {
  const { cliente, entrar } = useAuth();
  const avisar = useToast();
  const navegar = useNavigate();
  const voltarPara = useLocation().state?.voltarPara ?? '/minha-conta';
  const [form, setForm] = useState({ login: '', senha: '' });
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (cliente) return <Navigate to={voltarPara} replace />;

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro('');
    try {
      await entrar(form.login, form.senha);
      avisar('Bem-vindo de volta!');
      navegar(voltarPara, { replace: true });
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  return (
    <div className="container estreito">
      <form className="formulario" onSubmit={enviar} noValidate>
        <h1>Entrar</h1>
        <Campo rotulo="Login" autoComplete="username" required value={form.login} onChange={mudar('login')} />
        <Campo
          rotulo="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={form.senha}
          onChange={mudar('senha')}
        />
        {erro && (
          <p className="alerta alerta--erro" role="alert">
            {erro}
          </p>
        )}
        <button className="botao botao--primario botao--largo" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
        <p className="formulario__rodape">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" state={{ voltarPara }}>
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
