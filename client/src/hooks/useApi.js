import { useEffect, useState } from 'react';

/**
 * Executa uma chamada à API quando as dependências mudam.
 * Ignora respostas antigas se o usuário mudar de página no meio.
 */
export function useApi(chamada, dependencias) {
  const [estado, setEstado] = useState({ dados: null, erro: null, carregando: true });

  useEffect(() => {
    let ativo = true;
    setEstado((e) => ({ ...e, carregando: true, erro: null }));
    chamada()
      .then((dados) => ativo && setEstado({ dados, erro: null, carregando: false }))
      .catch((erro) => ativo && setEstado({ dados: null, erro, carregando: false }));
    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  return estado;
}
