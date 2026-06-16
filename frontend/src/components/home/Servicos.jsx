import { scrollToSection } from '../../utils/smoothScroll';

const ITEMS = [
  { num: '01', tag: 'Social Media', title: 'Gestão de Redes Sociais', desc: 'Estratégia, publicação e gestão de comunidade. Consistência e voz de marca em cada publicação.' },
  { num: '02', tag: 'Content',      title: 'Criação de Conteúdo',      desc: '+250 conteúdos mensais criados à medida. Fotografia, vídeo, reels e copywriting que convertem.' },
  { num: '03', tag: 'Real Estate',  title: 'Marketing Imobiliário',    desc: 'Especialistas em promover imóveis nas redes sociais. Apresentações visuais que aceleram vendas.' },
  { num: '04', tag: 'Strategy',     title: 'Estratégia Digital',       desc: 'Análise, planeamento e execução de uma estratégia coerente. Da identidade à conversão.' },
  { num: '05', tag: 'Brand',        title: 'Copywriting & Branding',   desc: 'Textos com alma e identidade visual consistente. Fazemos a tua marca falar com a voz certa.' },
];

export default function Servicos() {
  return (
    <section className="section servicos" id="servicos">
      <div className="container">
        <div className="sec-head">
          <p className="label r">O que fazemos</p>
          <h2 className="sec-title r">Serviços que<br /><em>transformam</em> marcas</h2>
        </div>
        <div className="sv-list">
          {ITEMS.map(it => (
            <div key={it.num} className="sv-item r">
              <div className="sv-meta"><span className="sv-num">{it.num}</span><span className="sv-tag">{it.tag}</span></div>
              <h3>{it.title}</h3>
              <p>{it.desc}</p>
            </div>
          ))}
          <div className="sv-cta r">
            <p>Tens um projeto?</p>
            <a href="#contacto" className="btn-line"
              onClick={e => { e.preventDefault(); scrollToSection('#contacto'); }}>
              Vamos conversar <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
