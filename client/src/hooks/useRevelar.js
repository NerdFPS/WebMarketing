import { useEffect } from 'react';

const SELETOR = '[data-revelar]:not(.visivel)';

/**
 * Faz os elementos com o atributo `data-revelar` entrarem suavemente
 * quando aparecem na tela. Observa também o que é carregado depois
 * (ex.: produtos vindos da API), via MutationObserver.
 *
 * Cada execução observa de novo tudo o que ainda não apareceu, então nada
 * fica invisível se o efeito for desmontado antes da hora (StrictMode,
 * troca de rota). Sem JavaScript, ou com "reduzir movimento", tudo já
 * aparece: o estado escondido só existe sob a classe `js-movimento`.
 */
export function useRevelar(chave) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    document.documentElement.classList.add('js-movimento');

    const visto = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
            visto.unobserve(entrada.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );

    // Observar o mesmo elemento duas vezes não tem efeito, então é seguro
    // repetir a busca a cada mudança no DOM.
    const observarPendentes = () => document.querySelectorAll(SELETOR).forEach((el) => visto.observe(el));

    observarPendentes();
    const mudancas = new MutationObserver(observarPendentes);
    mudancas.observe(document.getElementById('root'), { childList: true, subtree: true });

    return () => {
      visto.disconnect();
      mudancas.disconnect();
    };
  }, [chave]);
}
