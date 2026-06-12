export default function BoardHeader({
  selectedClient,
  selectedClientColor,
  cards,
  inReview,
  approved,
  published,
  platforms,
  handleBack,
  handleOpenCreate,
}) {
  return (
    <div className="board-header">
      <div className="board-header__top">
        <div className="board-header__left">
          <button className="btn-back" onClick={handleBack}>← Voltar</button>
          <div className={`board-header__avatar ${selectedClientColor}`}>
            {selectedClient.company_name.charAt(0)}
          </div>
          <div className="board-header__info">
            <h1>{selectedClient.company_name}</h1>
            <p>{selectedClient.contact_email}</p>
          </div>
          <span className="board-header__badge">Ativo</span>
        </div>
        <div className="board-header__actions">
          <button className="btn-new" onClick={handleOpenCreate}>+ Novo Conteúdo</button>
        </div>
      </div>
      <div className="board-header__stats">
        <div className="board-header__stat">
          <span className="stat-label">Conteúdos</span>
          <span className="stat-value">{cards.length}</span>
        </div>
        <div className="board-header__stat">
          <span className="stat-label">Plataformas</span>
          <span className="stat-value">{platforms.length}</span>
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
          <span className="stat-label">Redes sociais</span>
          <span className="stat-value">{selectedClient.social_networks}</span>
        </div>
      </div>
    </div>
  );
}
