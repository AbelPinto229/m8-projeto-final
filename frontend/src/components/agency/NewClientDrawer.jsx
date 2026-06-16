// drawer lateral para criar um novo cliente/projeto
// fecha ao clicar no overlay fora do drawer
const DRAWER_COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#0f172a'];

export default function NewClientDrawer({
  showNewClientModal,
  setShowNewClientModal,
  clientForm,
  setClientForm,
  clientColor,
  setClientColor,
  handleClientFormSubmit,
}) {
  // não renderiza nada se o drawer estiver fechado
  if (!showNewClientModal) return null;

  return (
    // overlay escuro — clique fora fecha o drawer
    <div className="drawer-overlay" onClick={() => setShowNewClientModal(false)}>
      {/* stopPropagation para impedir que cliques dentro do drawer fechem o overlay */}
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer__header">
          <h2>Novo Projeto</h2>
          <button className="modal__close" onClick={() => setShowNewClientModal(false)}>✕</button>
        </div>
        <form className="drawer__form" onSubmit={handleClientFormSubmit}>
          <div className="form-group">
            <label>Nome do projeto *</label>
            <input
              type="text"
              placeholder="Nome da empresa"
              value={clientForm.company_name}
              onChange={(e) => setClientForm({ ...clientForm, company_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email de contacto *</label>
            <input
              type="email"
              placeholder="email@empresa.com"
              value={clientForm.contact_email}
              onChange={(e) => setClientForm({ ...clientForm, contact_email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Redes sociais *</label>
            {/* redes separadas por vírgula: instagram,facebook,tiktok */}
            <input
              type="text"
              placeholder="instagram,facebook,tiktok"
              value={clientForm.social_networks}
              onChange={(e) => setClientForm({ ...clientForm, social_networks: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Cor do projeto</label>
            {/* seletor de cor com 8 opções — a cor ativa tem anel visual */}
            <div className="color-picker">
              {DRAWER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-dot ${clientColor === color ? 'color-dot--active' : ''}`}
                  style={{ background: color }}
                  onClick={() => setClientColor(color)}
                />
              ))}
            </div>
          </div>
          <div className="drawer__actions">
            <button type="button" className="btn-cancel" onClick={() => setShowNewClientModal(false)}>Cancelar</button>
            <button type="submit" className="btn-new">Criar Projeto</button>
          </div>
        </form>
      </div>
    </div>
  );
}
