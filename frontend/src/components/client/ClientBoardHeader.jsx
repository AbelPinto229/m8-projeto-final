export default function ClientBoardHeader({ client, cards, inReview, approved, published, platforms }) {
  return (
    <div className="board-header">
      <div className="board-header__top">
        <div className="board-header__left">
          <div className="board-header__avatar color-0">
            {client.company_name.charAt(0)}
          </div>
          <div className="board-header__info">
            <h1>Olá, {client.company_name}!</h1>
            <p>{client.contact_email}</p>
          </div>
          <span className="board-header__badge">Ativo</span>
        </div>
      </div>
      <div className="board-header__stats">
        <div className="board-header__stat">
          <span className="stat-label">Conteúdos</span>
          <span className="stat-value">{cards.length}</span>
        </div>
        <div className="board-header__stat">
          <span className="stat-label">Em revisão</span>
          <span className="stat-value">{inReview.length}</span>
        </div>
        <div className="board-header__stat">
          <span className="stat-label">Aprovados</span>
          <span className="stat-value">{approved.length}</span>
        </div>
        <div className="board-header__stat">
          <span className="stat-label">Publicados</span>
          <span className="stat-value">{published.length}</span>
        </div>
        <div className="board-header__stat">
          <span className="stat-label">Plataformas</span>
          <span className="stat-value">{platforms.length}</span>
        </div>
        <div className="board-header__stat">
          <span className="stat-label">Redes sociais</span>
          <span className="stat-value">{client.social_networks}</span>
        </div>
      </div>
    </div>
  );
}
