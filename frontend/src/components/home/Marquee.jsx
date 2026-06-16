// carrossel infinito horizontal com os serviços da agência
// os itens são duplicados para criar o loop contínuo via animação CSS
const ITEMS = [
  'Gestão de Redes Sociais', 'Criação de Conteúdo', 'Marketing Imobiliário',
  'Fotografia & Vídeo', 'Estratégia Digital', 'Copywriting',
];

export default function Marquee() {
  return (
    <div className="marquee-wrap">
      {/* track com os itens duplicados — a animação CSS move-o continuamente para a esquerda */}
      <div className="marquee-track">
        {[...ITEMS, ...ITEMS].map((s, i) => (
          <span key={i}>{s}<i style={{ marginLeft: '2.5rem' }}>✦</i></span>
        ))}
      </div>
    </div>
  );
}
