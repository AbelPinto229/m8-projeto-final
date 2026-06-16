// galeria de portfólio em grid masonry com 6 trabalhos realizados
// cls define a largura do item no grid (wide = largura dupla, tall = altura dupla)
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
      {/* grid com os itens — cada um tem imagem de fundo e overlay com tag e título */}
      <div className="port-grid">
        {ITEMS.map((it, i) => (
          <div key={i} className={`pi r ${it.cls}`}>
            <div className={`pi-img ${it.img}`} />
            {/* overlay que aparece ao hover com tag e título */}
            <div className="pi-ov">
              <span>{it.tag}</span>
              <h4>{it.title}</h4>
            </div>
          </div>
        ))}
      </div>
      {/* link para o instagram da agência para ver mais trabalhos */}
      <div className="port-more r">
        <a href="https://www.instagram.com/offscroll.agency/" target="_blank" rel="noreferrer" className="btn-line">
          Ver mais no Instagram <span>→</span>
        </a>
      </div>
    </section>
  );
}
