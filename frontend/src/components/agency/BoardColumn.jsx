// coluna do kanban da agência
function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
}

function formatDateTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function BoardColumn({ col, handleCardClick }) {
  return (
    <div className="board__column">
      <div className="board__column-header">
        <div className="board__column-header-left">
          <span className={`board__column-dot ${col.dot}`}></span>
          <h2>{col.label}</h2>
        </div>
        <span className="board__column-count">{col.items.length}</span>
      </div>
      <div className="board__droppable">
        {col.items.map((card) => (
          <div key={card.id} className="board__card" onClick={() => handleCardClick(card)}>
            <h3>{card.title}</h3>
            {/* data de publicação planeada — todas as colunas */}
            {card.scheduled_date && (
              <p style={{ margin: '4px 0 2px', fontSize: '11px', color: '#6366f1' }}>
                📅 Publicação: {formatDate(card.scheduled_date)}
              </p>
            )}
            {/* linha com tag + info contextual + comentários, tudo no mesmo nível */}
            <div className="board__card__row">
              <span className="board__card__tag">{card.social_network}</span>
              <div className="board__card__row-right">
                {col.id === 'in_review' && card.review_deadline && (
                  <span className="board__card__deadline">⏱ Data Limite: {formatDate(card.review_deadline)}</span>
                )}
                {col.id === 'approved' && card.approved_at && (
                  <span className="board__card__approved">✓ {formatDateTime(card.approved_at)}</span>
                )}
                {col.id === 'published' && card.published_at && (
                  <span className="board__card__published">📅 {formatDate(card.published_at)}</span>
                )}
                {card.comment_count > 0 && (
                  <span className="board__card__comments">💬 {card.comment_count}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
