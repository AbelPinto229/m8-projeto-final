const ITEMS = [
  { cls: 'pi-wide', img: 'pimg-1', tag: 'Social Media', title: 'Personal Trainer — BFX Therapy' },
  { cls: '',        img: 'pimg-2', tag: 'Imobiliário',  title: 'Moradia T4 — Lisboa' },
  { cls: '',        img: 'pimg-3', tag: 'Eventos',      title: 'Lançamento de produto' },
  { cls: '',        img: 'pimg-4', tag: 'Wellness',     title: 'Centro de terapia' },
  { cls: 'pi-tall', img: 'pimg-5', tag: 'Branding',     title: 'Identidade visual — Restaurante' },
  { cls: '',        img: 'pimg-6', tag: 'Imobiliário',  title: 'Apartamento T2 — Setúbal' },
];

export default function Portfolio() {
  return (
    <section className="section portfolio" id="portfolio">
      <div className="container">
        <div className="sec-head">
          <p className="label r">Portfólio</p>
          <h2 className="sec-title r">Trabalho que<br /><em>fala</em> por si</h2>
        </div>
      </div>
      <div className="port-grid">
        {ITEMS.map((it, i) => (
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
        <a href="https://www.instagram.com/offscroll.agency/" target="_blank" rel="noreferrer" className="btn-line">
          Ver mais no Instagram <span>→</span>
        </a>
      </div>
    </section>
  );
}
