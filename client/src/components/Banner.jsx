import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconeSeta } from './Icones.jsx';

const SLIDES = [
  {
    imagem: '/images/banners/web-market.png',
    titulo: 'Bem-vindo ao Web Market',
    texto: 'O supermercado completo, a um clique de distância.',
    link: '/setor/alimenticios',
    acao: 'Ver ofertas',
  },
  {
    imagem: '/images/banners/conheca.png',
    titulo: 'Conheça nossos setores',
    texto: 'Laticínios, alimentícios, utensílios e higiene.',
    link: '/setor/laticinios',
    acao: 'Explorar',
  },
];

const INTERVALO_MS = 6000;

/** Carrossel acessível: troca sozinho, pausa com o mouse e tem setas e pontos. */
export default function Banner() {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);

  const ir = useCallback((n) => setAtual((n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (pausado) return undefined;
    const id = setInterval(() => setAtual((a) => (a + 1) % SLIDES.length), INTERVALO_MS);
    return () => clearInterval(id);
  }, [pausado]);

  return (
    <section
      className="banner"
      aria-roledescription="carrossel"
      aria-label="Destaques"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.imagem}
          className={`banner__slide ${i === atual ? 'banner__slide--ativo' : ''}`}
          aria-hidden={i !== atual}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} de ${SLIDES.length}`}
        >
          <img src={slide.imagem} alt="" />
          <div className="banner__texto">
            <div>
              <h1>{slide.titulo}</h1>
              <p>{slide.texto}</p>
            </div>
            <Link className="botao botao--primario" to={slide.link} tabIndex={i === atual ? 0 : -1}>
              {slide.acao}
            </Link>
          </div>
        </div>
      ))}

      <button className="banner__seta banner__seta--esq" aria-label="Slide anterior" onClick={() => ir(atual - 1)}>
        <IconeSeta direcao="esquerda" />
      </button>
      <button className="banner__seta banner__seta--dir" aria-label="Próximo slide" onClick={() => ir(atual + 1)}>
        <IconeSeta />
      </button>

      <div className="banner__pontos">
        {SLIDES.map((s, i) => (
          <button
            key={s.imagem}
            className={i === atual ? 'ativo' : ''}
            aria-label={`Ir para o slide ${i + 1}`}
            aria-current={i === atual}
            onClick={() => ir(i)}
          />
        ))}
      </div>
    </section>
  );
}
