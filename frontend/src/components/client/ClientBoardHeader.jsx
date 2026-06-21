// cabeçalho do dashboard do cliente — mesma estrutura CSS do BoardHeader da agência
const COLORS = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5'];

export default function ClientBoardHeader({ client, cards, inReview, approved, published, platforms, onBack }) {
  const cardColor   = client.color || null;
  const fallback    = COLORS[client.id % COLORS.length];
  const avatarClass = cardColor ? '' : ` ${fallback}`;
  const avatarStyle = cardColor ? { background: cardColor } : undefined;

  return (
    <div className="board-header">
      <div className="board-header__top">
        <div className="board-header__left">
          {onBack && (
            <button className="btn-back" onClick={onBack}>← Voltar</button>
          )}
          <div className={`board-header__avatar${avatarClass}`} style={avatarStyle}>
            {client.company_name.charAt(0)}
          </div>
          <div className="board-header__info">
            <h1>{client.company_name}</h1>
            <p>{client.contact_email}</p>
          </div>
          <span className={`board-header__badge${client.status === 'inativo' ? ' board-header__badge--inactive' : ''}`}>
            {client.status === 'inativo' ? 'Inativo' : 'Ativo'}
          </span>
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
          <span className="stat-value">{client.social_networks}</span>
        </div>
      </div>
    </div>
  );
}
