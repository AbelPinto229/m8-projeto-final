// secção "quem somos" com descrição da agência e 3 estatísticas principais
export default function QuemSomos() {
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
            {/* estatísticas rápidas para transmitir escala e compromisso */}
            <div className="qs-stats r">
              <div className="stat"><strong>+250</strong><span>conteúdos/mês</span></div>
              <div className="stat"><strong>100%</strong><span>dedicação</span></div>
              <div className="stat"><strong>2</strong><span>áreas de atuação</span></div>
            </div>
          </div>
        </div>
        {/* placeholder da foto da equipa */}
        <div className="qs-img r">
          <div className="img-ph team-photo"></div>
          <p className="qs-caption">A equipa OffScroll — movidos pela criatividade.</p>
        </div>
      </div>
    </section>
  );
}
