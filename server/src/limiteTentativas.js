/**
 * Limita tentativas de login erradas por IP + login, em memória.
 * Depois de `maximo` erros dentro da janela, novas tentativas são
 * recusadas até a janela passar. Um login certo zera o contador.
 */
export function criarLimiteTentativas({ maximo = 5, janelaMs = 15 * 60 * 1000, agora = Date.now } = {}) {
  const falhas = new Map();

  const limpar = () => {
    const limite = agora() - janelaMs;
    for (const [chave, registro] of falhas) if (registro.inicio < limite) falhas.delete(chave);
  };

  return {
    /** Segundos até poder tentar de novo, ou 0 se está liberado. */
    bloqueadoPor(chave) {
      limpar();
      const registro = falhas.get(chave);
      if (!registro || registro.total < maximo) return 0;
      return Math.ceil((registro.inicio + janelaMs - agora()) / 1000);
    },
    registrarFalha(chave) {
      const registro = falhas.get(chave);
      if (registro) registro.total++;
      else falhas.set(chave, { total: 1, inicio: agora() });
    },
    zerar(chave) {
      falhas.delete(chave);
    },
  };
}
