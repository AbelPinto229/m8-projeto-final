// utilitário de animação — observa todos os elementos com classe .r e adiciona .vis quando entram no viewport
// não renderiza nenhum elemento no DOM — apenas executa o efeito
import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.r');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // adiciona a classe .vis que dispara a animação CSS de entrada
          e.target.classList.add('vis');
          // para de observar o elemento após a primeira vez — a animação só ocorre uma vez
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}
