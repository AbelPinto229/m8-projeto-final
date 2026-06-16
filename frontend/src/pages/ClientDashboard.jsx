import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, getCardsByClient, getCommentsByCard, createComment, deleteComment, updateCardStatus } from '../services/api';
import ClientNavbar       from '../components/client/ClientNavbar';
import ClientBoardHeader  from '../components/client/ClientBoardHeader';
import ClientBoardColumn  from '../components/client/ClientBoardColumn';
import ClientCardModal    from '../components/client/ClientCardModal';
import '../styles/AgencyDashboard.css';
import '../styles/ClientDashboard.css';

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
  const [approveLoading, setApproveLoading] = useState(false);

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

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleApprove = async () => {
    setApproveLoading(true);
    await updateCardStatus(selectedCard.id, 'approved');
    const data = await getCardsByClient(clientId);
    setCards(data);
    setApproveLoading(false);
    handleCloseModal();
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

  const inReview  = cards.filter((c) => c.status === 'in_review');
  const approved  = cards.filter((c) => c.status === 'approved');
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
      <ClientNavbar onBrandClick={() => navigate('/')} onLogout={() => navigate('/')} />

      <ClientBoardHeader
        client={client}
        cards={cards}
        inReview={inReview}
        approved={approved}
        published={published}
        platforms={platforms}
      />

      <div className="board-wrapper">
        <div className="board">
          {[
            { id: 'in_review', label: 'Em revisão', dot: 'dot-review',    items: inReview },
            { id: 'approved',  label: 'Aprovado',   dot: 'dot-approved',  items: approved },
            { id: 'published', label: 'Publicado',  dot: 'dot-published', items: published },
          ].map((col) => (
            <ClientBoardColumn key={col.id} col={col} handleCardClick={handleCardClick} />
          ))}
        </div>
      </div>

      {selectedCard && (
        <ClientCardModal
          selectedCard={selectedCard}
          comments={comments}
          commentForm={commentForm}
          setCommentForm={setCommentForm}
          commentLoading={commentLoading}
          aiMetrics={aiMetrics}
          handleCloseModal={handleCloseModal}
          handleDeleteComment={handleDeleteComment}
          handleCommentSubmit={handleCommentSubmit}
          handleApprove={handleApprove}
          approveLoading={approveLoading}
        />
      )}
    </div>
  );
}

export default ClientDashboard;
