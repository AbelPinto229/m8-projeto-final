export default function CardModal({
  selectedCard,
  comments,
  metrics,
  activeTab,
  setActiveTab,
  editMode,
  setEditMode,
  editForm,
  setEditForm,
  editImagePreviews,
  metricsForm,
  setMetricsForm,
  aiSuggestion,
  aiMetrics,
  statusLoading,
  showDeleteConfirm,
  setShowDeleteConfirm,
  handleCloseModal,
  handleStatusChange,
  handleEditOpen,
  handleEditSave,
  handleEditImageChange,
  handleDeleteComment,
  handleMetricsSubmit,
  handleDeleteCard,
  handleAcceptAISuggestion,
}) {
  return (
    <>
      {showDeleteConfirm && (
        <div className="modal-overlay" style={{ zIndex: 500 }} onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal modal--confirm" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">Eliminar card</h2>
            <p className="confirm-text">
              Tens a certeza que queres eliminar <strong>"{selectedCard?.title}"</strong>? Esta ação não pode ser revertida.
            </p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
              <button className="btn-delete-confirm" onClick={handleDeleteCard}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <div className="modal-overlay" onClick={handleCloseModal}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal__close" onClick={handleCloseModal}>✕</button>
          <div className="modal__tabs">
            <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>Detalhes</button>
            <button className={activeTab === 'ai' ? 'active' : ''} onClick={() => setActiveTab('ai')}>Sugestão IA</button>
            <button className={activeTab === 'report' ? 'active' : ''} onClick={() => setActiveTab('report')}>Relatório</button>
          </div>

          {activeTab === 'details' && !editMode && (
            <div className="modal__content">
              <div className="modal__left">
                <h2>{selectedCard.title}</h2>
                {selectedCard.image_url && <img src={selectedCard.image_url} alt="card" />}
                <p>{selectedCard.body}</p>
                <p><strong>Rede social:</strong> {selectedCard.social_network}</p>
                <p><strong>Data planeada:</strong> {selectedCard.scheduled_date ? new Date(selectedCard.scheduled_date).toLocaleDateString('pt-PT') : '—'}</p>
                <div className="modal__actions">
                  {selectedCard.status === 'approved' && (
                    <button onClick={() => handleStatusChange('published')} disabled={statusLoading}>
                      {statusLoading ? 'A publicar...' : 'Publicar'}
                    </button>
                  )}
                  <button className="btn-edit" onClick={handleEditOpen}>Editar</button>
                  <button className="btn-delete" onClick={() => setShowDeleteConfirm(true)}>Eliminar</button>
                </div>
              </div>
              <div className="modal__right">
                <h3>Comentários</h3>
                {comments.length === 0 && <p>Sem comentários.</p>}
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="comment"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}
                  >
                    <p><strong>{comment.type}:</strong> {comment.message}</p>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', flexShrink: 0 }}
                    >✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'details' && editMode && (
            <div className="modal__content">
              <div className="modal__left">
                <div className="form-group">
                  <label>Título *</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Descrição *</label>
                  <textarea
                    value={editForm.body}
                    onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Plataforma</label>
                    <select
                      value={editForm.social_network}
                      onChange={(e) => setEditForm({ ...editForm, social_network: e.target.value })}
                    >
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="tiktok">TikTok</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Data limite</label>
                    <input
                      type="date"
                      value={editForm.scheduled_date}
                      onChange={(e) => setEditForm({ ...editForm, scheduled_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Imagem</label>
                  <label className="image-upload-area">
                    <input type="file" accept="image/*" onChange={handleEditImageChange} />
                    <p>📎 Clica para alterar a imagem</p>
                    <span>PNG, JPG, WEBP</span>
                  </label>
                </div>
                <div className="modal__actions">
                  <button onClick={() => handleEditSave(false)}>Guardar</button>
                  <button onClick={() => handleEditSave(true)}>Guardar e reanalisar</button>
                  <button className="btn-cancel" onClick={() => setEditMode(false)}>Cancelar</button>
                </div>
              </div>
              <div className="modal__right">
                <div className="card-preview">
                  <p className="card-preview__label">Preview do card</p>
                  <div className="card-preview__box">
                    {editImagePreviews.length > 0
                      ? <img src={editImagePreviews[0]} alt="preview" className="card-preview__image" />
                      : <div className="card-preview__image-placeholder">📷 Sem imagem</div>
                    }
                    <div className="card-preview__body">
                      <span className="board__card__tag">{editForm.social_network}</span>
                      <h3>{editForm.title}</h3>
                      <p>{editForm.body}</p>
                      {editForm.scheduled_date && <p className="card-preview__date">📅 {editForm.scheduled_date}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="modal__ai-tab">
              {!aiSuggestion && <p className="ai-placeholder">Sem sugestão da IA para este card.</p>}
              {aiSuggestion && (
                <>
                  <div className="ai-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3>Conteúdo melhorado</h3>
                        <p>{aiSuggestion.improved_content}</p>
                      </div>
                      <button
                        onClick={handleAcceptAISuggestion}
                        style={{
                          padding: '8px 16px',
                          background: '#10b981',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '12px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          marginTop: '2px',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#059669'}
                        onMouseLeave={(e) => e.target.style.background = '#10b981'}
                      >
                        ✓ Aceitar
                      </button>
                    </div>
                  </div>
                  <div className="ai-section">
                    <h3>Hashtags</h3>
                    <div className="ai-hashtags">
                      {aiSuggestion.hashtags?.map((tag, i) => (
                        <span key={i} className="ai-hashtag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="ai-section">
                    <h3>Melhor horário</h3>
                    <p>{aiSuggestion.best_time}</p>
                  </div>
                  <div className="ai-section">
                    <h3>Feedback da data</h3>
                    <p>{aiSuggestion.date_feedback}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'report' && (
            <div className="modal__report">
              {aiMetrics && (
                <div className="report-section">
                  <p className="report-section__title">Previsão da IA</p>
                  <div className="report-metrics-grid">
                    <div className="report-metric"><span>Alcance</span><strong>{aiMetrics.reach}</strong></div>
                    <div className="report-metric"><span>Likes</span><strong>{aiMetrics.likes}</strong></div>
                    <div className="report-metric"><span>Comentários</span><strong>{aiMetrics.comments}</strong></div>
                    <div className="report-metric"><span>Partilhas</span><strong>{aiMetrics.shares}</strong></div>
                  </div>
                  {aiMetrics.analysis && <p className="report-analysis">{aiMetrics.analysis}</p>}
                </div>
              )}
              <div className="report-section">
                <p className="report-section__title">Métricas reais</p>
                <form onSubmit={handleMetricsSubmit} className="report-form">
                  <div className="report-form__grid">
                    <div className="form-group">
                      <label>Alcance</label>
                      <input type="number" min="0" placeholder="0" value={metricsForm.reach} onChange={(e) => setMetricsForm({ ...metricsForm, reach: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Likes</label>
                      <input type="number" min="0" placeholder="0" value={metricsForm.likes} onChange={(e) => setMetricsForm({ ...metricsForm, likes: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Comentários</label>
                      <input type="number" min="0" placeholder="0" value={metricsForm.comments_count} onChange={(e) => setMetricsForm({ ...metricsForm, comments_count: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Partilhas</label>
                      <input type="number" min="0" placeholder="0" value={metricsForm.shares} onChange={(e) => setMetricsForm({ ...metricsForm, shares: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Data de publicação</label>
                    <input type="date" value={metricsForm.published_at} onChange={(e) => setMetricsForm({ ...metricsForm, published_at: e.target.value })} />
                  </div>
                  <button type="submit" className="report-save-btn">
                    {metrics ? 'Atualizar métricas' : 'Guardar métricas'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
