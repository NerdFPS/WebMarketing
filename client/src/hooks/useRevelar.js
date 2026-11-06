import { useEffect } from 'react';

/**
 * Faz os elementos com o atributo `data-revelar` entrarem suavemente
 * quando aparecem na tela. Observa também o que é carregado depois
 * (ex.: produtos vindos da API), via MutationObserver.
 *
 * Sem JavaScript, ou com "reduzir movimento", tudo já aparece visível:
 * o estado escondido só existe sob a classe `js-movimento` no <html>.
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

    const observarNovos = () => {
      document.querySelectorAll('[data-revelar]:not(.visivel):not([data-observado])').forEach((el) => {
        el.setAttribute('data-observado', '');
        visto.observe(el);
      });
    };

    observarNovos();
    const mudancas = new MutationObserver(observarNovos);
    mudancas.observe(document.getElementById('root'), { childList: true, subtree: true });

    return () => {
      visto.disconnect();
      mudancas.disconnect();
    };
  }, [chave]);
}
