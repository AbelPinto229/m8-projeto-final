// cabeçalho do dashboard do cliente com saudação personalizada e estatísticas dos conteúdos
export default function ClientBoardHeader({ client, cards, inReview, approved, published, platforms }) {
  return (
    <div className="board-header">
      <div className="board-header__top">
        <div className="board-header__left">
          {/* avatar com a inicial da empresa */}
          <div className="board-header__avatar color-0">
            {client.company_name.charAt(0)}
          </div>
          <div className="board-header__info">
            {/* saudação personalizada com o nome da empresa */}
            <h1>Olá, {client.company_name}!</h1>
            <p>{client.contact_email}</p>
          </div>
          {/* badge de estado — muda de aparência se o cliente estiver inativo */}
          <span className={`board-header__badge${client.status === 'inativo' ? ' board-header__badge--inactive' : ''}`}>
            {client.status === 'inativo' ? 'Inativo' : 'Ativo'}
          </span>
        </div>
      </div>
      {/* linha de estatísticas resumidas dos conteúdos do cliente */}
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
