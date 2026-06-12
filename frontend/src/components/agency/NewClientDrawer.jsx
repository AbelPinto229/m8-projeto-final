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
  if (!showNewClientModal) return null;

  return (
    <div className="drawer-overlay" onClick={() => setShowNewClientModal(false)}>
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
