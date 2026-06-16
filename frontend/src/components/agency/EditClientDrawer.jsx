// drawer lateral para editar um cliente existente, com modal de confirmação de eliminação
const DRAWER_COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#0f172a'];

export default function EditClientDrawer({
  editClientModal,
  setEditClientModal,
  editClientForm,
  setEditClientForm,
  handleEditClientSubmit,
  showDeleteConfirmModal,
  setShowDeleteConfirmModal,
  handleDeleteClient,
}) {
  // não renderiza nada se nenhum cliente estiver selecionado para edição
  if (!editClientModal) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={() => setEditClientModal(null)}>
        <div className="drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer__header">
            <h2>Editar Projeto</h2>
            <button className="modal__close" onClick={() => setEditClientModal(null)}>✕</button>
          </div>
          <form className="drawer__form" onSubmit={handleEditClientSubmit}>
            <div className="form-group">
              <label>Nome do projeto *</label>
              <input
                type="text"
                value={editClientForm.company_name}
                onChange={(e) => setEditClientForm({ ...editClientForm, company_name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Redes sociais</label>
              <input
                type="text"
                placeholder="instagram,facebook,tiktok"
                value={editClientForm.social_networks}
                onChange={(e) => setEditClientForm({ ...editClientForm, social_networks: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              {/* permite mudar o cliente de ativo para inativo sem o eliminar */}
              <select
                value={editClientForm.status}
                onChange={(e) => setEditClientForm({ ...editClientForm, status: e.target.value })}
                style={{ padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', background: '#f8fafc', outline: 'none' }}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Cor do projeto</label>
              {/* seletor de cor com 8 opções — a cor ativa tem anel visual */}
              <div className="color-picker">
                {DRAWER_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-dot ${editClientForm.color === color ? 'color-dot--active' : ''}`}
                    style={{ background: color }}
                    onClick={() => setEditClientForm({ ...editClientForm, color })}
                  />
                ))}
              </div>
            </div>
            <div className="drawer__actions">
              <button type="button" className="btn-cancel" onClick={() => setEditClientModal(null)}>Cancelar</button>
              <button type="submit" className="btn-new">Guardar</button>
            </div>
            {/* zona perigosa — abre o modal de confirmação antes de eliminar */}
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #fee2e2' }}>
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(true)}
                style={{ width: '100%', padding: '10px', background: '#fef2f2', color: '#ef4444', border: '1.5px solid #fecaca', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                🗑 Eliminar projeto
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* modal de confirmação — aparece por cima do drawer quando o utilizador clica em eliminar */}
      {showDeleteConfirmModal && (
        <div className="confirm-overlay" onClick={() => setShowDeleteConfirmModal(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal__icon">🗑</div>
            <h3 className="confirm-modal__title">Eliminar projeto</h3>
            <p className="confirm-modal__body">
              Tens a certeza que queres eliminar <strong>{editClientModal.company_name}</strong>?<br />
              Esta ação é irreversível.
            </p>
            <div className="confirm-modal__actions">
              <button className="confirm-modal__cancel" onClick={() => setShowDeleteConfirmModal(false)}>Cancelar</button>
              <button className="confirm-modal__confirm" onClick={handleDeleteClient}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
