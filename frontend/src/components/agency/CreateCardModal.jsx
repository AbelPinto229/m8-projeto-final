export default function CreateCardModal({
  createForm,
  setCreateForm,
  imagePreviews,
  createLoading,
  createdCard,
  handleCloseCreate,
  handleCreateSubmit,
  handleImageChange,
  handleRemoveImage,
}) {
  return (
    <div className="modal-overlay" onClick={handleCloseCreate}>
      <div className="modal modal--create" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={handleCloseCreate}>✕</button>
        <h2 className="modal__title">Novo Conteúdo</h2>
        <div className="modal__content">
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
                  <label>Data limite *</label>
                  <input
                    type="date"
                    value={createForm.scheduled_date}
                    onChange={(e) => setCreateForm({ ...createForm, scheduled_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Imagens</label>
                <label className="image-upload-area">
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                  <p>📎 Clica para adicionar imagens</p>
                  <span>PNG, JPG, WEBP</span>
                </label>
                {imagePreviews.length > 0 && (
                  <div className="image-previews">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="image-preview">
                        <img src={src} alt="" />
                        <button className="image-preview__remove" onClick={() => handleRemoveImage(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="btn-new" disabled={createLoading}>
                {createLoading ? 'A analisar...' : 'Guardar e analisar'}
              </button>
            </form>
          </div>
          <div className="modal__right">
            <div className="card-preview">
              <p className="card-preview__label">Preview do card</p>
              <div className="card-preview__box">
                {imagePreviews.length > 0
                  ? <img src={imagePreviews[0]} alt="preview" className="card-preview__image" />
                  : <div className="card-preview__image-placeholder">📷 Sem imagem</div>
                }
                <div className="card-preview__body">
                  <span className="board__card__tag">{createForm.social_network || 'instagram'}</span>
                  <h3>{createForm.title || 'Título do conteúdo'}</h3>
                  <p>{createForm.body || 'Descrição do conteúdo...'}</p>
                  {createForm.scheduled_date && <p className="card-preview__date">📅 {createForm.scheduled_date}</p>}
                </div>
              </div>
            </div>
            {!createdCard && !createLoading && (
              <p className="ai-placeholder">Clica em "Guardar e analisar" para receber sugestões da IA.</p>
            )}
            {createLoading && <p className="ai-placeholder">⏳ A analisar conteúdo...</p>}
            {createdCard?.ai_suggestion && (() => {
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
