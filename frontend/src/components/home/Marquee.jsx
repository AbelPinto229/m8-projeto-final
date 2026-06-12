const ITEMS = [
  'Gestão de Redes Sociais', 'Criação de Conteúdo', 'Marketing Imobiliário',
  'Fotografia & Vídeo', 'Estratégia Digital', 'Copywriting',
];

export default function Marquee() {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...ITEMS, ...ITEMS].map((s, i) => (
          <span key={i}>{s}<i style={{ marginLeft: '2.5rem' }}>✦</i></span>
        ))}
      </div>
    </div>
  );
}
