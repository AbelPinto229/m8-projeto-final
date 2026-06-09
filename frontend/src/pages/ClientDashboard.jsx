import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, getCardsByClient, getCommentsByCard, createComment, deleteComment } from '../services/api';
import '../styles/AgencyDashboard.css';
import '../styles/ClientDashboard.css';

const STATUS_LABELS = { in_review: 'Em revisão', approved: 'Aprovado', published: 'Publicado' };

function ClientDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clientId = parseInt(id);

  const [client, setClient] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ message: '', type: 'comment' });
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    getClientById(clientId).then(setClient);
    getCardsByClient(clientId).then(setCards);
  }, [clientId]);

  const handleCardClick = async (card) => {
    setSelectedCard(card);
    setCommentForm({ message: '', type: 'comment' });
    const data = await getCommentsByCard(card.id);
    setComments(data);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
    setComments([]);
  };

  const handleDeleteComment = async (id) => {
    await deleteComment(id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.message.trim()) return;
    setCommentLoading(true);
    const newComment = await createComment({
      card_id: selectedCard.id,
      client_id: clientId,
      message: commentForm.message,
      type: commentForm.type,
    });
    setComments((prev) => [...prev, newComment]);
    setCommentForm({ message: '', type: 'comment' });
    setCommentLoading(false);
  };

  const inReview = cards.filter((c) => c.status === 'in_review');
  const approved = cards.filter((c) => c.status === 'approved');
  const published = cards.filter((c) => c.status === 'published');

  const platforms = client?.social_networks
    ? client.social_networks.split(',').filter(Boolean)
    : [];

  const aiMetrics = selectedCard?.ai_metrics_prediction
    ? typeof selectedCard.ai_metrics_prediction === 'string'
      ? JSON.parse(selectedCard.ai_metrics_prediction)
      : selectedCard.ai_metrics_prediction
    : null;

  if (!client) return <div className="agency-dashboard" style={{ padding: '2rem', color: '#94a3b8' }}>A carregar...</div>;

  return (
    <div className="agency-dashboard">
      {/* ── Navbar ── */}
      <nav className="client-navbar">
        <span className="client-navbar__brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}><span className="client-navbar__brand-off">OFF</span><span className="client-navbar__brand-scroll">SCROLL.</span></span>
        <button className="client-navbar__logout" onClick={() => navigate('/')}>Sair</button>
      </nav>

      {/* ── Header ── */}
      <div className="board-header">
        <div className="board-header__top">
          <div className="board-header__left">
            <div className="board-header__avatar color-0">
              {client.company_name.charAt(0)}
            </div>
            <div className="board-header__info">
              <h1>Olá, {client.company_name}!</h1>
              <p>{client.contact_email}</p>
            </div>
            <span className="board-header__badge">Ativo</span>
          </div>
        </div>

        <div className="board-header__stats">
          <div className="board-header__stat">
            <span className="stat-label">Conteúdos</span>
            <span className="stat-value">{cards.length}</span>
          </div>
          <div className="board-header__stat">
            <span className="stat-label">Em revisão</span>
            <span className="stat-value">{inReview.length}</span>
          </div>
          <div className="board-header__stat">
            <span className="stat-label">Aprovados</span>
            <span className="stat-value">{approved.length}</span>
          </div>
          <div className="board-header__stat">
            <span className="stat-label">Publicados</span>
            <span className="stat-value">{published.length}</span>
          </div>
          <div className="board-header__stat">
            <span className="stat-label">Plataformas</span>
            <span className="stat-value">{platforms.length}</span>
          </div>
          <div className="board-header__stat">
            <span className="stat-label">Redes sociais</span>
            <span className="stat-value">{client.social_networks}</span>
          </div>
        </div>
      </div>

      {/* ── Board ── */}
      <div className="board-wrapper">
        <div className="board">
          {[
            { id: 'in_review', label: 'Em revisão', dot: 'dot-review', items: inReview },
            { id: 'approved', label: 'Aprovado', dot: 'dot-approved', items: approved },
            { id: 'published', label: 'Publicado', dot: 'dot-published', items: published },
          ].map((col) => (
            <div key={col.id} className="board__column">
              <div className="board__column-header">
                <div className="board__column-header-left">
                  <span className={`board__column-dot ${col.dot}`}></span>
                  <h2>{col.label}</h2>
                </div>
                <span className="board__column-count">{col.items.length}</span>
              </div>

              {col.items.length === 0
                ? <p className="client-column__empty">Sem conteúdos</p>
                : col.items.map((card) => (
                    <div key={card.id} className="board-card" onClick={() => handleCardClick(card)}>
                      <p className="board-card__title">{card.title}</p>
                      <div className="board-card__footer">
                        <span className="board__card__tag">{card.social_network}</span>
                        {card.scheduled_date && (
                          <span className="board-card__date">
                            {new Date(card.scheduled_date).toLocaleDateString('pt-PT')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
              }
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal ── */}
      {selectedCard && (
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
              {/* Esquerda */}
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

              {/* Direita — chat */}
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
                          <button onClick={() => handleDeleteComment(comment.id)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px', opacity: 0.6 }}>✕</button>
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
      )}
    </div>
  );
}

export default ClientDashboard;
