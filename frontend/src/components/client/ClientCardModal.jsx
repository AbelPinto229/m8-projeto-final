const STATUS_LABELS = { in_review: 'Em revisão', approved: 'Aprovado', published: 'Publicado' };

export default function ClientCardModal({
  selectedCard,
  comments,
  commentForm,
  setCommentForm,
  commentLoading,
  aiMetrics,
  handleCloseModal,
  handleDeleteComment,
  handleCommentSubmit,
}) {
  return (
    <div className="client-modal-overlay" onClick={handleCloseModal}>
      <div className="client-modal" onClick={(e) => e.stopPropagation()}>
        <button className="client-modal__close" onClick={handleCloseModal}>✕</button>

        <div className="client-modal__header">
          <h2 className="client-modal__title">{selectedCard.title}</h2>
          <div className="client-modal__meta">
            <span className="board__card__tag">{selectedCard.social_network}</span>
            <span className="client-modal__meta-text">{STATUS_LABELS[selectedCard.status]}</span>
            {selectedCard.scheduled_date && (
              <span className="client-modal__meta-text">
                {new Date(selectedCard.scheduled_date).toLocaleDateString('pt-PT')}
              </span>
            )}
          </div>
        </div>

        <div className="client-modal__body">
          <div className="client-modal__left">
            {selectedCard.image_url
              ? <img src={selectedCard.image_url} alt="card" className="client-modal__image" />
              : <div className="client-modal__image-placeholder">📷 Sem imagem</div>
            }
            <p className="client-modal__body-text">{selectedCard.body}</p>

            {aiMetrics && (
              <div className="client-modal__metrics">
                <p className="client-modal__metrics-title">Previsão de métricas</p>
                <div className="client-modal__metrics-grid">
                  <div className="client-modal__metric-item">
                    <span>Alcance</span>
                    <strong>{aiMetrics.reach}</strong>
                  </div>
                  <div className="client-modal__metric-item">
                    <span>Likes</span>
                    <strong>{aiMetrics.likes}</strong>
                  </div>
                  <div className="client-modal__metric-item">
                    <span>Comentários</span>
                    <strong>{aiMetrics.comments}</strong>
                  </div>
                  <div className="client-modal__metric-item">
                    <span>Partilhas</span>
                    <strong>{aiMetrics.shares}</strong>
                  </div>
                </div>
                {aiMetrics.analysis && (
                  <p className="client-modal__metric-analysis">{aiMetrics.analysis}</p>
                )}
              </div>
            )}
          </div>

          <div className="client-modal__right">
            <div className="client-chat__header">
              <h3>Comentários</h3>
            </div>
            <div className="client-chat__messages">
              {comments.length === 0
                ? <p className="client-chat__empty">Sem comentários ainda.</p>
                : comments.map((comment) => (
                    <div key={comment.id} className="client-chat__bubble" style={{ position: 'relative' }}>
                      <p className="client-chat__bubble-type">
                        {comment.type === 'suggestion' ? 'Sugestão' : 'Comentário'}
                      </p>
                      <p className="client-chat__bubble-text">{comment.message}</p>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px', opacity: 0.6 }}
                      >✕</button>
                    </div>
                  ))
              }
            </div>
            <form onSubmit={handleCommentSubmit} className="client-chat__form">
              <select
                className="client-chat__type-select"
                value={commentForm.type}
                onChange={(e) => setCommentForm({ ...commentForm, type: e.target.value })}
              >
                <option value="comment">Comentário</option>
                <option value="suggestion">Sugestão</option>
              </select>
              <div className="client-chat__input-row">
                <textarea
                  className="client-chat__textarea"
                  placeholder="Escreve o teu comentário..."
                  value={commentForm.message}
                  onChange={(e) => setCommentForm({ ...commentForm, message: e.target.value })}
                  required
                />
                <button type="submit" className="client-chat__send" disabled={commentLoading}>
                  {commentLoading ? '...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
