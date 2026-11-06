import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [cliente, setCliente] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Recupera a sessão (cookie) ao abrir o site.
  useEffect(() => {
    let ativo = true;
    api
      .eu()
      .then((c) => ativo && setCliente(c))
      .catch(() => ativo && setCliente(null))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(async (login, senha) => setCliente(await api.entrar(login, senha)), []);
  const cadastrar = useCallback(async (dados) => setCliente(await api.cadastrar(dados)), []);
  const atualizar = useCallback(async (dados) => setCliente(await api.atualizarConta(dados)), []);
  const sair = useCallback(async () => {
    await api.sair().catch(() => {});
    setCliente(null);
  }, []);
  const excluirConta = useCallback(async () => {
    await api.excluirConta();
    setCliente(null);
  }, []);

  const valor = useMemo(
    () => ({ cliente, carregando, entrar, cadastrar, atualizar, sair, excluirConta }),
    [cliente, carregando, entrar, cadastrar, atualizar, sair, excluirConta],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
