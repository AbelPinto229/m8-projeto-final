const DRAWER_COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#0f172a'];

export default function NewClientDrawer({
  showNewClientModal,
  setShowNewClientModal,
  clientForm,
  setClientForm,
  clientColor,
  setClientColor,
  handleClientFormSubmit,
  errorMsg = '',
}) {
  if (!showNewClientModal) return null;

  return (
    <div className="drawer-overlay" onClick={() => setShowNewClientModal(false)}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a', margin: '24px 0 16px' }}>Novo Projeto</p>
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
          {errorMsg && (
            <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: '0 0 12px', padding: '8px 12px', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
              {errorMsg}
            </p>
          )}
          <div className="drawer__actions">
            <button type="button" className="btn-cancel" onClick={() => setShowNewClientModal(false)}>Cancelar</button>
            <button type="submit" className="btn-new">Criar Projeto</button>
          </div>
        </form>
      </div>
    </div>
  );
}
