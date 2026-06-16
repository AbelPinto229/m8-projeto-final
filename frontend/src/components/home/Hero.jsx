// secção hero da página inicial com efeito parallax nos blobs de fundo
import { useEffect, useRef } from 'react';
import { scrollToSection } from '../../utils/smoothScroll';

export default function Hero() {
  // refs para os dois blobs — permitem mover os elementos diretamente sem re-render
  const b1Ref = useRef(null);
  const b2Ref = useRef(null);

  // move os blobs em direções opostas conforme o scroll para criar efeito parallax
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (b1Ref.current) b1Ref.current.style.transform = `translateY(${y * .12}px)`;
      if (b2Ref.current) b2Ref.current.style.transform = `translateY(${y * -.08}px)`;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="hero" id="hero">
      {/* camada de ruído visual por cima do gradiente */}
      <div className="hero-noise" />
      <div className="hero-blob b1" ref={b1Ref} />
      <div className="hero-blob b2" ref={b2Ref} />
      <div className="hero-content">
        <p className="hero-pre r">Marketing com propósito</p>
        {/* cada span tem classe .r para ser animado pelo ScrollReveal */}
        <h1 className="hero-title">
          <span className="ht r">Conectamos</span>
          <span className="ht r italic">marcas</span>
          <span className="ht r">a pessoas</span>
          <span className="ht r italic">reais.</span>
        </h1>
        <div className="hero-foot r">
          <p>Gestão de redes sociais, criação de conteúdo<br />e marketing imobiliário. +250 conteúdos/mês.</p>
          <a href="#contacto" className="btn-line" onClick={e => { e.preventDefault(); scrollToSection('#contacto'); }}>
            Pedir orçamento <span>→</span>
          </a>
        </div>
      </div>
      {/* indicador visual de scroll no canto inferior */}
      <div className="hero-scroller">
        <span>scroll</span>
        <div className="hs-bar" />
      </div>
    </section>
  );
}
