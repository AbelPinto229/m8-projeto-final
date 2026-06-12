const REVIEWS = [
  { ini: 'JM', name: 'João Martins', role: 'Personal Trainer',          quote: 'A OffScroll transformou completamente a presença online do nosso negócio. Em 3 meses triplicámos o engagement.' },
  { ini: 'AS', name: 'Ana Silva',    role: 'Agente Imobiliária',         quote: 'Profissionalismo e criatividade em cada conteúdo. A nossa imobiliária nunca teve tanta visibilidade.' },
  { ini: 'RN', name: 'Rita Nunes',   role: 'Terapeuta',                  quote: 'Finalmente uma agência que entende a nossa voz. Consistência e qualidade todos os meses, sem exceção.' },
  { ini: 'MC', name: 'Miguel Costa', role: 'Proprietário — Restaurante', quote: 'Entregam sempre a tempo com qualidade. Um nível de criatividade que os clientes notam logo.' },
];

export default function Reviews() {
  return (
    <section className="section reviews" id="reviews">
      <div className="container">
        <div className="rv-head">
          <p className="label r">Testemunhos</p>
          <h2 className="sec-title r">Não acredite em nós.<br />Acredite nos nossos<br /><em>clientes.</em></h2>
        </div>
        <div className="rv-grid">
          {REVIEWS.map((r, i) => (
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
