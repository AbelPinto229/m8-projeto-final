// cabeçalho do kanban de um cliente específico com estatísticas e botão de novo conteúdo
const COLORS = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5'];

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
  // se a cor é hex usa inline style, se é classe css usa className
  const isHex      = selectedClientColor && selectedClientColor.startsWith('#');
  const avatarClass = isHex ? 'board-header__avatar' : `board-header__avatar ${selectedClientColor || COLORS[selectedClient.id % COLORS.length]}`;
  const avatarStyle = isHex ? { background: selectedClientColor } : undefined;

  return (
    <div className="board-header">
      <div className="board-header__top">
        <div className="board-header__left">
          {/* botão de voltar à lista de clientes */}
          <button className="btn-back" onClick={handleBack}>← Voltar</button>
          {/* avatar com a inicial da empresa e a cor do projeto */}
          <div className={avatarClass} style={avatarStyle}>
            {selectedClient.company_name.charAt(0)}
          </div>
          <div className="board-header__info">
            <h1>{selectedClient.company_name}</h1>
            <p>{selectedClient.contact_email}</p>
          </div>
          {/* badge de estado — vermelho se inativo */}
          <span className={`board-header__badge${selectedClient.status === 'inativo' ? ' board-header__badge--inactive' : ''}`}>
            {selectedClient.status === 'inativo' ? 'Inativo' : 'Ativo'}
          </span>
        </div>
        <div className="board-header__actions">
          <button className="btn-new" onClick={handleOpenCreate}>+ Novo Conteúdo</button>
        </div>
      </div>
      {/* linha de estatísticas rápidas do cliente */}
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
