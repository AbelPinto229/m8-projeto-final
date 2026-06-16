const COLORS = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5'];

const formatNetworks = (str) =>
  str
    ? str.split(',').map((s) => s.trim()).filter(Boolean)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
    : '';

export default function ClientCard({ client, handleClientClick, handleOpenEditClient }) {
  const isInativo = client.status === 'inativo';
  const cardColor = client.color || null;
  const fallbackClass = COLORS[client.id % COLORS.length];

  return (
    <div
      className={`proj-card${isInativo ? ' proj-card--inactive' : ''}`}
      onClick={() => handleClientClick(client)}
    >
      <div
        className={`proj-card-banner${isInativo ? ' color-inactive' : cardColor ? '' : ` ${fallbackClass}`}`}
        style={!isInativo && cardColor ? { background: cardColor } : undefined}
      >
        <span className="proj-card-name">{client.company_name}</span>
        <button className="proj-card-edit-btn" onClick={(e) => handleOpenEditClient(e, client)}>Editar</button>
        {isInativo && <span className="proj-card-status-tag">Inativo</span>}
      </div>
      <div className="proj-card-body">
        <p className="proj-card-desc">{formatNetworks(client.social_networks)}</p>
        <div className="proj-card-footer">
          <div className="proj-card-stats">
            <span className="proj-stat">📄 {client.card_count}</span>
          </div>
          <div className="proj-members-stack">
            <div
              className={`member-avatar${isInativo ? ' color-inactive' : cardColor ? '' : ` ${fallbackClass}`}`}
              style={!isInativo && cardColor ? { background: cardColor } : undefined}
            >
              {client.company_name.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
