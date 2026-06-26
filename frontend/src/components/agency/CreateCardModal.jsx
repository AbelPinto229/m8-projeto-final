// modal para criar um novo conteúdo com preview ao vivo e sugestões da ia após submissão
export default function CreateCardModal({
  createForm,
  setCreateForm,
  createLoading,
  createdCard,
  handleCloseCreate,
  handleCreateSubmit,
}) {
  return (
    <div className="modal-overlay" onClick={handleCloseCreate}>
      <div className="modal modal--create" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={handleCloseCreate}>✕</button>
        <h2 className="modal__title">Novo Conteúdo</h2>
        <div className="modal__content">
          {/* lado esquerdo com o formulário de criação */}
          <div className="modal__left">
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  placeholder="Título do conteúdo"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descrição *</label>
                <textarea
                  placeholder="Notas, roteiro, referências..."
                  value={createForm.body}
                  onChange={(e) => setCreateForm({ ...createForm, body: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Plataforma</label>
                  <select
                    value={createForm.social_network}
                    onChange={(e) => setCreateForm({ ...createForm, social_network: e.target.value })}
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="tiktok">TikTok</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Data de publicação *</label>
                  <input
                    type="date"
                    value={createForm.scheduled_date}
                    onChange={(e) => setCreateForm({ ...createForm, scheduled_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Data limite de revisão</label>
                <input
                  type="date"
                  value={createForm.review_deadline}
                  onChange={(e) => setCreateForm({ ...createForm, review_deadline: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>URL da imagem</label>
                {/* colar o link do canva ou de outra fonte — vai direto para a bd */}
                <input
                  type="url"
                  placeholder="https://... (link do Canva ou outra fonte)"
                  value={createForm.image_url}
                  onChange={(e) => setCreateForm({ ...createForm, image_url: e.target.value })}
                />
              </div>
              {/* desativado enquanto a ia está a processar */}
              <button type="submit" className="btn-new" disabled={createLoading}>
                {createLoading ? 'A analisar...' : 'Guardar e analisar'}
              </button>
            </form>
          </div>
          {/* lado direito com preview do card e sugestões da ia */}
          <div className="modal__right">
            <div className="card-preview">
              <p className="card-preview__label">Preview do card</p>
              {/* o preview atualiza em tempo real conforme o utilizador preenche o formulário */}
              <div className="card-preview__box">
                {createForm.image_url
                  ? <img src={createForm.image_url} alt="preview" className="card-preview__image" />
                  : <div className="card-preview__image-placeholder">📷 Sem imagem</div>
                }
                <div className="card-preview__body">
                  <h3>{createForm.title || 'Título do conteúdo'}</h3>
                  {createForm.scheduled_date && (
                    <p className="card-preview__date" style={{ color: '#6366f1', margin: '4px 0 2px', fontSize: '12px' }}>
                      📅 Publicação: {createForm.scheduled_date.split('-').slice(1).reverse().join('/')}
                    </p>
                  )}
                  <div className="board__card__row">
                    <span className="board__card__tag">{createForm.social_network || 'instagram'}</span>
                    <div className="board__card__row-right">
                      {createForm.review_deadline && (
                        <span className="board__card__deadline">
                          ⏱ Data Limite: {createForm.review_deadline.split('-').slice(1).reverse().join('/')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* estados da sugestão da ia: à espera, a processar ou resultado */}
            {!createdCard && !createLoading && (
              <p className="ai-placeholder">Clica em "Guardar e analisar" para receber sugestões da IA.</p>
            )}
            {createLoading && <p className="ai-placeholder">⏳ A analisar conteúdo...</p>}
            {createdCard?.ai_suggestion && (() => {
              // ai_suggestion pode vir como string json ou objeto — normaliza aqui
              const ai = typeof createdCard.ai_suggestion === 'string'
                ? JSON.parse(createdCard.ai_suggestion)
                : createdCard.ai_suggestion;
              return (
                <div className="modal__ai">
                  <h3>Sugestão da IA</h3>
                  <p><strong>Conteúdo melhorado:</strong> {ai.improved_content}</p>
                  <p><strong>Hashtags:</strong> {ai.hashtags?.join(' ')}</p>
                  <p><strong>Melhor horário:</strong> {ai.best_time}</p>
                  <p><strong>Feedback da data:</strong> {ai.date_feedback}</p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
