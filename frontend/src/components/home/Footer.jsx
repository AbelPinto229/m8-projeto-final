import { scrollToSection } from '../../utils/smoothScroll';

export default function Footer() {
  function smooth(e, hash) {
    e.preventDefault();
    scrollToSection(hash);
  }

  return (
    <footer className="footer">
      <div className="ft-top">
        <a href="#hero" className="ft-logo" onClick={e => smooth(e, '#hero')}>
          <span className="logo-off">OFF</span><span className="logo-scroll">scroll.</span>
        </a>
        <p className="ft-tagline">Conectamos marcas a pessoas reais.</p>
      </div>
      <div className="ft-mid">
        <nav className="ft-nav">
          <a href="#quem-somos" onClick={e => smooth(e, '#quem-somos')}>Quem somos</a>
          <a href="#servicos"   onClick={e => smooth(e, '#servicos')}>Serviços</a>
          <a href="#portfolio"  onClick={e => smooth(e, '#portfolio')}>Portfólio</a>
          <a href="#reviews"    onClick={e => smooth(e, '#reviews')}>Clientes</a>
          <a href="#contacto"   onClick={e => smooth(e, '#contacto')}>Contacto</a>
        </nav>
        <a href="https://www.instagram.com/offscroll.agency/" target="_blank" rel="noreferrer" className="ft-ig">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          Instagram
        </a>
      </div>
      <div className="ft-bottom">
        <span>© 2025 OffScroll. Todos os direitos reservados.</span>
        <span>Lisboa, Portugal</span>
      </div>
    </footer>
  );
}
