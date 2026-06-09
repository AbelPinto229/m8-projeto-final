import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <QuemSomos />
      <Servicos />
      <Portfolio />
      <Reviews />
      <Contacto />
      <Footer />
      <ScrollReveal />
    </>
  );
}

/* ─── NAV ──────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 50); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function smoothScroll(e, hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    setOpen(false);
  }

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a href="#hero" className="nav-logo" onClick={e => smoothScroll(e, '#hero')}>
          <span className="logo-off">OFF</span><span className="logo-scroll">scroll.</span>
        </a>
        <ul className="nav-links">
          <li><a href="#quem-somos" onClick={e => smoothScroll(e, '#quem-somos')}>Quem somos</a></li>
          <li><a href="#servicos"   onClick={e => smoothScroll(e, '#servicos')}>Serviços</a></li>
          <li><a href="#portfolio"  onClick={e => smoothScroll(e, '#portfolio')}>Portfólio</a></li>
          <li><a href="#reviews"    onClick={e => smoothScroll(e, '#reviews')}>Clientes</a></li>
          <li><a href="#contacto" className="nav-cta" onClick={e => smoothScroll(e, '#contacto')}>Vamos conversar</a></li>
          <li><Link to="/agencia" className="nav-cliente">Área Reservada</Link></li>
        </ul>
        <button className={`hamburger${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span /><span />
        </button>
      </nav>

      <div className={`mobile-menu${open ? ' open' : ''}`}>
        <ul>
          <li><a href="#quem-somos" className="mob-link" onClick={e => smoothScroll(e, '#quem-somos')}>Quem somos</a></li>
          <li><a href="#servicos"   className="mob-link" onClick={e => smoothScroll(e, '#servicos')}>Serviços</a></li>
          <li><a href="#portfolio"  className="mob-link" onClick={e => smoothScroll(e, '#portfolio')}>Portfólio</a></li>
          <li><a href="#reviews"    className="mob-link" onClick={e => smoothScroll(e, '#reviews')}>Clientes</a></li>
          <li><a href="#contacto"   className="mob-link" onClick={e => smoothScroll(e, '#contacto')}>Vamos conversar</a></li>
        </ul>
        <div className="mob-actions">
          <Link to="/agencia" className="mob-cliente-btn" onClick={() => setOpen(false)}>Área Reservada</Link>
        </div>
        <p className="mob-tagline">Conectamos marcas<br />a pessoas reais.</p>
      </div>
    </>
  );
}

/* ─── HERO ──────────────────────────────────────────────────── */
function Hero() {
  const b1Ref = useRef(null);
  const b2Ref = useRef(null);

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
      <div className="hero-noise" />
      <div className="hero-blob b1" ref={b1Ref} />
      <div className="hero-blob b2" ref={b2Ref} />
      <div className="hero-content">
        <p className="hero-pre r">Marketing com propósito</p>
        <h1 className="hero-title">
          <span className="ht r">Conectamos</span>
          <span className="ht r italic">marcas</span>
          <span className="ht r">a pessoas</span>
          <span className="ht r italic">reais.</span>
        </h1>
        <div className="hero-foot r">
          <p>Gestão de redes sociais, criação de conteúdo<br />e marketing imobiliário. +250 conteúdos/mês.</p>
          <a href="#contacto" className="btn-line" onClick={e => {
            const t = document.getElementById('contacto');
            if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
          }}>Pedir orçamento <span>→</span></a>
        </div>
      </div>
      <div className="hero-scroller">
        <span>scroll</span>
        <div className="hs-bar" />
      </div>
    </section>
  );
}

/* ─── MARQUEE ───────────────────────────────────────────────── */
function Marquee() {
  const items = [
    'Gestão de Redes Sociais', 'Criação de Conteúdo', 'Marketing Imobiliário',
    'Fotografia & Vídeo', 'Estratégia Digital', 'Copywriting',
  ];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...items, ...items].map((s, i) => (
          <span key={i}>{s}<i style={{ marginLeft: '2.5rem' }}>✦</i></span>
        ))}
      </div>
    </div>
  );
}

/* ─── QUEM SOMOS ────────────────────────────────────────────── */
function QuemSomos() {
  return (
    <section className="section qs" id="quem-somos">
      <div className="container">
        <div className="qs-top">
          <div className="qs-left">
            <p className="label r">Quem somos</p>
            <h2 className="sec-title r">Criatividade<br />com <em>propósito</em></h2>
          </div>
          <div className="qs-right">
            <p className="r">Somos a <strong>OffScroll</strong> — uma agência especializada em gestão de redes sociais e marketing imobiliário. Acreditamos que cada marca tem uma história única e o nosso trabalho é contá-la com criatividade, consistência e resultados reais.</p>
            <p className="r">Trabalhamos lado a lado com os nossos clientes, entregando mais de <strong>250 conteúdos mensais</strong> sem abrir mão da qualidade.</p>
            <div className="qs-stats r">
              <div className="stat"><strong>+250</strong><span>conteúdos/mês</span></div>
              <div className="stat"><strong>100%</strong><span>dedicação</span></div>
              <div className="stat"><strong>2</strong><span>áreas de atuação</span></div>
            </div>
          </div>
        </div>
        <div className="qs-img r">
          <div className="img-ph"><span>Foto da equipa OffScroll</span></div>
          <p className="qs-caption">A equipa OffScroll — movidos pela criatividade.</p>
        </div>
      </div>
    </section>
  );
}

/* ─── SERVIÇOS ──────────────────────────────────────────────── */
function Servicos() {
  const items = [
    { num: '01', tag: 'Social Media', title: 'Gestão de Redes Sociais', desc: 'Estratégia, publicação e gestão de comunidade. Consistência e voz de marca em cada publicação.' },
    { num: '02', tag: 'Content',      title: 'Criação de Conteúdo',      desc: '+250 conteúdos mensais criados à medida. Fotografia, vídeo, reels e copywriting que convertem.' },
    { num: '03', tag: 'Real Estate',  title: 'Marketing Imobiliário',    desc: 'Especialistas em promover imóveis nas redes sociais. Apresentações visuais que aceleram vendas.' },
    { num: '04', tag: 'Strategy',     title: 'Estratégia Digital',       desc: 'Análise, planeamento e execução de uma estratégia coerente. Da identidade à conversão.' },
    { num: '05', tag: 'Brand',        title: 'Copywriting & Branding',   desc: 'Textos com alma e identidade visual consistente. Fazemos a tua marca falar com a voz certa.' },
  ];
  return (
    <section className="section servicos" id="servicos">
      <div className="container">
        <div className="sec-head">
          <p className="label r">O que fazemos</p>
          <h2 className="sec-title r">Serviços que<br /><em>transformam</em> marcas</h2>
        </div>
        <div className="sv-list">
          {items.map(it => (
            <div key={it.num} className="sv-item r">
              <div className="sv-meta"><span className="sv-num">{it.num}</span><span className="sv-tag">{it.tag}</span></div>
              <h3>{it.title}</h3>
              <p>{it.desc}</p>
            </div>
          ))}
          <div className="sv-cta r">
            <p>Tens um projeto?</p>
            <a href="#contacto" className="btn-line light" onClick={e => {
              const t = document.getElementById('contacto');
              if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
            }}>Vamos conversar <span>→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PORTFOLIO ─────────────────────────────────────────────── */
function Portfolio() {
  const items = [
    { cls: 'pi-wide', img: 'pimg-1', tag: 'Social Media', title: 'Personal Trainer — BFX Therapy' },
    { cls: '',        img: 'pimg-2', tag: 'Imobiliário',  title: 'Moradia T4 — Lisboa' },
    { cls: '',        img: 'pimg-3', tag: 'Eventos',      title: 'Lançamento de produto' },
    { cls: '',        img: 'pimg-4', tag: 'Wellness',     title: 'Centro de terapia' },
    { cls: 'pi-tall', img: 'pimg-5', tag: 'Branding',     title: 'Identidade visual — Restaurante' },
    { cls: '',        img: 'pimg-6', tag: 'Imobiliário',  title: 'Apartamento T2 — Setúbal' },
  ];
  return (
    <section className="section portfolio" id="portfolio">
      <div className="container">
        <div className="sec-head">
          <p className="label r">Portfólio</p>
          <h2 className="sec-title r">Trabalho que<br /><em>fala</em> por si</h2>
        </div>
      </div>
      <div className="port-grid">
        {items.map((it, i) => (
          <div key={i} className={`pi r ${it.cls}`}>
            <div className={`pi-img ${it.img}`} />
            <div className="pi-ov">
              <span>{it.tag}</span>
              <h4>{it.title}</h4>
            </div>
          </div>
        ))}
      </div>
      <div className="port-more r">
        <a href="https://www.instagram.com/offscrollmarketing.pt/" target="_blank" rel="noreferrer" className="btn-line">
          Ver mais no Instagram <span>→</span>
        </a>
      </div>
    </section>
  );
}

/* ─── REVIEWS ───────────────────────────────────────────────── */
function Reviews() {
  const reviews = [
    { ini: 'JM', name: 'João Martins', role: 'Personal Trainer',          quote: 'A OffScroll transformou completamente a presença online do nosso negócio. Em 3 meses triplicámos o engagement.' },
    { ini: 'AS', name: 'Ana Silva',    role: 'Agente Imobiliária',         quote: 'Profissionalismo e criatividade em cada conteúdo. A nossa imobiliária nunca teve tanta visibilidade.' },
    { ini: 'RN', name: 'Rita Nunes',   role: 'Terapeuta',                  quote: 'Finalmente uma agência que entende a nossa voz. Consistência e qualidade todos os meses, sem exceção.' },
    { ini: 'MC', name: 'Miguel Costa', role: 'Proprietário — Restaurante', quote: 'Entregam sempre a tempo com qualidade. Um nível de criatividade que os clientes notam logo.' },
  ];
  return (
    <section className="section reviews" id="reviews">
      <div className="container">
        <div className="rv-head">
          <p className="label r">Testemunhos</p>
          <h2 className="sec-title r">Não acredite em nós.<br />Acredite nos nossos<br /><em>clientes.</em></h2>
        </div>
        <div className="rv-grid">
          {reviews.map((r, i) => (
            <div key={i} className="rv-card r">
              <div className="rv-stars">★★★★★</div>
              <blockquote>"{r.quote}"</blockquote>
              <div className="rv-author">
                <div className="rv-av">{r.ini}</div>
                <div><strong>{r.name}</strong><span>{r.role}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACTO ──────────────────────────────────────────────── */
function Contacto() {
  const [form, setForm] = useState({ nome: '', email: '', servico: '', mensagem: '' });
  const [busy, setBusy] = useState(false);
  const [okShown, setOkShown] = useState(false);
  const [errFields, setErrFields] = useState(new Set());

  function update(k, v) {
    setForm(f => ({ ...f, [k]: v }));
    if (errFields.has(k)) {
      const next = new Set(errFields); next.delete(k); setErrFields(next);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    const errs = new Set();
    if (!form.nome.trim())     errs.add('nome');
    if (!form.email.trim())    errs.add('email');
    if (!form.mensagem.trim()) errs.add('mensagem');
    if (errs.size) { setErrFields(errs); return; }

    setBusy(true);
    setTimeout(() => {
      setForm({ nome: '', email: '', servico: '', mensagem: '' });
      setBusy(false);
      setOkShown(true);
      setTimeout(() => setOkShown(false), 5000);
    }, 1400);
  }

  function fieldStyle(name) {
    return errFields.has(name) ? { borderColor: '#c0392b' } : undefined;
  }

  return (
    <section className="section contacto" id="contacto">
      <div className="container">
        <div className="ct-grid">
          <div className="ct-left">
            <p className="label r">Vamos conversar</p>
            <h2 className="sec-title r">Pronto para fazer<br />algo <em>incrível?</em></h2>
            <p className="r">Conta-nos o teu projeto.<br />Respondemos em menos de 24 horas.</p>
            <div className="ct-info r">
              <a href="mailto:geral@offscroll.pt" className="ct-link">✉ geral@offscroll.pt</a>
              <a href="https://www.instagram.com/offscrollmarketing.pt/" target="_blank" rel="noreferrer" className="ct-link">◎ @offscrollmarketing.pt</a>
            </div>
          </div>
          <div className="ct-right r">
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="form-row">
                <div className="field">
                  <label>Nome *</label>
                  <input type="text" placeholder="O teu nome" required style={fieldStyle('nome')}
                    value={form.nome} onChange={e => update('nome', e.target.value)} />
                </div>
                <div className="field">
                  <label>Email *</label>
                  <input type="email" placeholder="email@exemplo.com" required style={fieldStyle('email')}
                    value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Serviço de interesse</label>
                <select value={form.servico} onChange={e => update('servico', e.target.value)}>
                  <option value="">Seleciona um serviço</option>
                  <option>Gestão de Redes Sociais</option>
                  <option>Criação de Conteúdo</option>
                  <option>Marketing Imobiliário</option>
                  <option>Estratégia Digital</option>
                  <option>Outro</option>
                </select>
              </div>
              <div className="field">
                <label>Mensagem *</label>
                <textarea rows={5} placeholder="Conta-nos sobre o teu projeto..." required style={fieldStyle('mensagem')}
                  value={form.mensagem} onChange={e => update('mensagem', e.target.value)} />
              </div>
              <button type="submit" className="btn-submit" disabled={busy}>
                <span>{busy ? 'A enviar...' : 'Enviar mensagem'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              {okShown && (
                <div className="form-ok" style={{ display: 'block' }}>✓ Mensagem enviada! Falamos em breve.</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────── */
function Footer() {
  function smooth(e, hash) {
    const t = document.querySelector(hash);
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
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
        <a href="https://www.instagram.com/offscrollmarketing.pt/" target="_blank" rel="noreferrer" className="ft-ig">
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

/* ─── SCROLL REVEAL ─────────────────────────────────────────── */
function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.r');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}
