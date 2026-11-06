import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCarrinho } from '../context/CartContext.jsx';
import { CATEGORIAS } from '../categorias.js';
import { IconeBusca, IconeCarrinho, IconeMenu, IconeUsuario } from './Icones.jsx';

export default function Cabecalho() {
  const { cliente } = useAuth();
  const { quantidade } = useCarrinho();
  const navegar = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const termoDaUrl = pathname === '/busca' ? (params.get('q') ?? '') : '';
  const [termo, setTermo] = useState(termoDaUrl);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  // Mantém a caixa de busca igual à URL (voltar/avançar, sair da busca).
  useEffect(() => {
    setTermo(termoDaUrl);
  }, [termoDaUrl]);

  function buscar(evento) {
    evento.preventDefault();
    const q = termo.trim();
    if (q) navegar(`/busca?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="cabecalho">
      <div className="cabecalho__topo container">
        <button
          className="botao-icone cabecalho__menu-btn"
          aria-label="Abrir menu"
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((v) => !v)}
        >
          <IconeMenu />
        </button>

        <Link to="/" className="cabecalho__logo" aria-label="Web Market — página inicial">
          <img src="/images/logo.png" alt="" width="64" height="48" />
          <span>Web Market</span>
        </Link>

        <form className="busca" role="search" onSubmit={buscar}>
          <input
            type="search"
            placeholder="Buscar produtos, marcas…"
            aria-label="Buscar produtos"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
          <button type="submit" aria-label="Buscar">
            <IconeBusca />
          </button>
        </form>

        <nav className="cabecalho__acoes" aria-label="Conta e carrinho">
          <Link to={cliente ? '/minha-conta' : '/entrar'} className="acao">
            <IconeUsuario />
            <span className="acao__texto">{cliente ? `Olá, ${cliente.nome.split(' ')[0]}` : 'Entrar'}</span>
          </Link>
          <Link to="/carrinho" className="acao" aria-label={`Carrinho com ${quantidade} itens`}>
            <span className="acao__icone">
              <IconeCarrinho />
              {quantidade > 0 && <span className="selo">{quantidade}</span>}
            </span>
            <span className="acao__texto">Carrinho</span>
          </Link>
        </nav>
      </div>

      <nav className={`menu ${menuAberto ? 'menu--aberto' : ''}`} aria-label="Setores">
        <ul className="container">
          <li>
            <NavLink to="/" end>
              Início
            </NavLink>
          </li>
          {CATEGORIAS.map((c) => (
            <li key={c.slug}>
              <NavLink to={`/setor/${c.slug}`}>{c.nome}</NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/sobre">Quem somos</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
