import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Campo from '../components/Campo.jsx';
import CamposEndereco from '../components/CamposEndereco.jsx';
import { mascaraCpf } from '../utils/formatar.js';

const VAZIO = { login: '', senha: '', confirmar: '', nome: '', cpf: '', cep: '', endereco: '', celular: '' };

export default function Cadastro() {
  const { cliente, cadastrar } = useAuth();
  const avisar = useToast();
  const navegar = useNavigate();
  const voltarPara = useLocation().state?.voltarPara ?? '/minha-conta';
  const [form, setForm] = useState(VAZIO);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (cliente) return <Navigate to={voltarPara} replace />;

  async function enviar(evento) {
    evento.preventDefault();
    if (form.senha !== form.confirmar) {
      setErros({ confirmar: 'As senhas não conferem.' });
      return;
    }
    setEnviando(true);
    setErros({});
    setErroGeral('');
    try {
      const { confirmar: _confirmar, ...dados } = form;
      await cadastrar(dados);
      avisar('Conta criada! Boas compras.');
      navegar(voltarPara, { replace: true });
    } catch (e) {
      setErros(e.campos ?? {});
      setErroGeral(e.message);
    } finally {
      setEnviando(false);
    }
  }

  const mudar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  return (
    <div className="container estreito">
      <form className="formulario" onSubmit={enviar} noValidate>
        <h1>Criar conta</h1>

        <Campo rotulo="Login" autoComplete="username" required value={form.login} erro={erros.login} onChange={mudar('login')} />
        <Campo
          rotulo="Senha"
          type="password"
          autoComplete="new-password"
          dica="Mínimo de 8 caracteres."
          required
          value={form.senha}
          erro={erros.senha}
          onChange={mudar('senha')}
        />
        <Campo
          rotulo="Confirme a senha"
          type="password"
          autoComplete="new-password"
          required
          value={form.confirmar}
          erro={erros.confirmar}
          onChange={mudar('confirmar')}
        />
        <Campo
          rotulo="CPF"
          inputMode="numeric"
          placeholder="000.000.000-00"
          required
          value={form.cpf}
          erro={erros.cpf}
          onChange={(e) => setForm((f) => ({ ...f, cpf: mascaraCpf(e.target.value) }))}
        />
        <CamposEndereco form={form} setForm={setForm} erros={erros} />

        {erroGeral && (
          <p className="alerta alerta--erro" role="alert">
            {erroGeral}
          </p>
        )}
        <button className="botao botao--primario botao--largo" disabled={enviando}>
          {enviando ? 'Criando conta…' : 'Criar conta'}
        </button>
        <p className="formulario__rodape">
          Já tem conta?{' '}
          <Link to="/entrar" state={{ voltarPara }}>
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
