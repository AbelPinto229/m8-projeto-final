// navbar principal da página home com detecção de scroll e menu mobile
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { scrollToSection } from '../../utils/smoothScroll';

export default function Nav() {
  // scrolled: true quando o utilizador passou os 50px — muda o estilo da nav
  const [scrolled, setScrolled] = useState(false);
  // open: controla se o menu mobile está aberto
  const [open, setOpen]         = useState(false);

  // listener de scroll para aplicar classe .scrolled à nav
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 50); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // bloqueia o scroll do body quando o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // faz scroll suave para a secção e fecha o menu mobile
  function handleLink(e, hash) {
    e.preventDefault();
    scrollToSection(hash);
    setOpen(false);
  }

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a href="#hero" className="nav-logo" onClick={e => handleLink(e, '#hero')}>
          <span className="logo-off">OFF</span><span className="logo-scroll">scroll.</span>
        </a>
        {/* links de navegação desktop */}
        <ul className="nav-links">
          <li><a href="#quem-somos" onClick={e => handleLink(e, '#quem-somos')}>Quem somos</a></li>
          <li><a href="#servicos"   onClick={e => handleLink(e, '#servicos')}>Serviços</a></li>
          <li><a href="#portfolio"  onClick={e => handleLink(e, '#portfolio')}>Portfólio</a></li>
          <li><a href="#reviews"    onClick={e => handleLink(e, '#reviews')}>Clientes</a></li>
          <li><a href="#contacto" className="nav-cta" onClick={e => handleLink(e, '#contacto')}>Vamos conversar</a></li>
          <li><Link to="/agencia" className="nav-cliente">Área Reservada</Link></li>
        </ul>
        {/* botão hamburger para mobile — alterna entre aberto e fechado */}
        <button className={`hamburger${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span /><span />
        </button>
      </nav>

      {/* menu mobile — aparece quando open=true */}
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        <ul>
          <li><a href="#quem-somos" className="mob-link" onClick={e => handleLink(e, '#quem-somos')}>Quem somos</a></li>
          <li><a href="#servicos"   className="mob-link" onClick={e => handleLink(e, '#servicos')}>Serviços</a></li>
          <li><a href="#portfolio"  className="mob-link" onClick={e => handleLink(e, '#portfolio')}>Portfólio</a></li>
          <li><a href="#reviews"    className="mob-link" onClick={e => handleLink(e, '#reviews')}>Clientes</a></li>
          <li><a href="#contacto"   className="mob-link" onClick={e => handleLink(e, '#contacto')}>Vamos conversar</a></li>
        </ul>
        <div className="mob-actions">
          <Link to="/agencia" className="mob-cliente-btn" onClick={() => setOpen(false)}>Área Reservada</Link>
        </div>
        <p className="mob-tagline">Conectamos marcas<br />a pessoas reais.</p>
      </div>
    </>
  );
}
