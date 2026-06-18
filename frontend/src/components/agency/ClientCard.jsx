// card de cliente na grelha do dashboard da agência
// mostra banner colorido, redes sociais, contagem de conteúdos e botão de edição
const COLORS = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5'];

// converte string separada por vírgulas em lista formatada com primeira letra maiúscula
const formatNetworks = (str) =>
  str
    ? str.split(',').map((s) => s.trim()).filter(Boolean)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
    : '';

export default function ClientCard({ client, handleClientClick, handleOpenEditClient }) {
  const isInativo = client.status === 'inativo';
  // cor personalizada definida pela agência, ou cor de fallback baseada no id
  const cardColor = client.color || null;
  const fallbackClass = COLORS[client.id % COLORS.length];

  return (
    <div
      className={`proj-card${isInativo ? ' proj-card--inactive' : ''}`}
      onClick={() => handleClientClick(client)}
    >
      {/* banner superior com a cor do projeto — cinzento se inativo */}
      <div
        className={`proj-card-banner${isInativo ? ' color-inactive' : cardColor ? '' : ` ${fallbackClass}`}`}
        style={!isInativo && cardColor ? { background: cardColor } : undefined}
      >
        <span className="proj-card-name">{client.company_name}</span>
        {/* stopPropagation para não abrir o cliente ao clicar em editar */}
        <button className="proj-card-edit-btn" onClick={(e) => handleOpenEditClient(e, client)}>Editar</button>
        {isInativo
          ? <span className="proj-card-status-tag">Inativo</span>
          : <span className="proj-card-status-tag proj-card-status-tag--ativo">Ativo</span>
        }
      </div>
      <div className="proj-card-body">
        {/* redes sociais formatadas em texto legível */}
        <p className="proj-card-desc">{formatNetworks(client.social_networks)}</p>
        <div className="proj-card-footer">
          <div className="proj-card-stats">
            {/* contagem de conteúdos do cliente */}
            <span className="proj-stat">📄 {client.card_count}</span>
          </div>
          {/* avatar com a inicial da empresa */}
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
