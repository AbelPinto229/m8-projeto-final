// página do dashboard do cliente — visualização do kanban com aprovação e comentários
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, getCardsByClient, getCommentsByCard, createComment, deleteComment, updateCardStatus, getNotificationsForClient, markNotificationRead, getMyClients, getMetricsByCard } from '../services/api';
import ClientNavbar       from '../components/client/ClientNavbar';
import ClientBoardHeader  from '../components/client/ClientBoardHeader';
import ClientBoardColumn  from '../components/client/ClientBoardColumn';
import ClientCardModal    from '../components/client/ClientCardModal';
import '../styles/AgencyDashboard.css';
import '../styles/ClientDashboard.css';

function ClientDashboard() {
  // id do cliente vem da url (/cliente/:id)
  const { id } = useParams();
  const navigate = useNavigate();
  const clientId = parseInt(id);

  // dados do cliente carregados da api
  const [client, setClient] = useState(null);
  const [notFound, setNotFound] = useState(false);
  // conteúdos do cliente separados nas 3 colunas do kanban
  const [cards, setCards] = useState([]);
  // conteúdo aberto no modal
  const [selectedCard, setSelectedCard] = useState(null);
  // comentários do conteúdo aberto
  const [comments, setComments] = useState([]);
  // métricas reais do conteúdo aberto — null se ainda não foram registadas pela agência
  const [metrics, setMetrics] = useState(null);
  // dados do formulário de novo comentário
  // type fixo em 'comment' — o dropdown foi removido
  const [commentForm, setCommentForm] = useState({ message: '' });
  // true enquanto o comentário está a ser enviado para a api
  const [commentLoading, setCommentLoading] = useState(false);
  // true enquanto a aprovação está a ser processada
  const [approveLoading, setApproveLoading] = useState(false);
  // notificações do cliente (de todos os projetos)
  const [notifications, setNotifications] = useState([]);
  // ids de todos os projetos do cliente — começa vazio, só faz polling depois de carregar
  const [allProjectIds, setAllProjectIds] = useState([]);

  // redireciona para login se não houver token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate('/login', { replace: true });
  }, []);

  // carrega cliente, conteúdos e notificações de todos os projetos ao montar
  useEffect(() => {
    getClientById(clientId)
      .then((data) => { if (!data) setNotFound(true); else setClient(data); })
      .catch(() => setNotFound(true));
    getCardsByClient(clientId)
      .then((data) => setCards(Array.isArray(data) ? data : []))
      .catch(() => setCards([]));
    getMyClients().then((data) => {
      if (!Array.isArray(data)) return;
      const ids = data.map((p) => p.id);
      setAllProjectIds(ids);
      Promise.all(ids.map((id) => getNotificationsForClient(id)))
        .then((results) => setNotifications(results.flat()))
        .catch(() => {});
    }).catch(() => {});
  }, [clientId]);

  // polling de cards e notificações (de todos os projetos) a cada 2s
  useEffect(() => {
    const interval = setInterval(() => {
      getCardsByClient(clientId).then(setCards);
      Promise.all(allProjectIds.map((id) => getNotificationsForClient(id)))
        .then((results) => setNotifications(results.flat()));
    }, 2000);
    return () => clearInterval(interval);
  }, [clientId, allProjectIds]);

  // polling de comentários quando o modal está aberto
  useEffect(() => {
    if (!selectedCard) return;
    const interval = setInterval(() => {
      getCommentsByCard(selectedCard.id).then(setComments);
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedCard?.id]);

  // abre o modal e carrega os comentários do conteúdo clicado
  const handleCardClick = async (card) => {
    setSelectedCard(card);
    setCommentForm({ message: '' });
    const [commentsData, metricsData] = await Promise.all([
      getCommentsByCard(card.id),
      getMetricsByCard(card.id),
    ]);
    setComments(commentsData);
    setMetrics(metricsData);
  };

  // fecha o modal e limpa os dados
  const handleCloseModal = () => {
    setSelectedCard(null);
    setComments([]);
    setMetrics(null);
  };

  // elimina um comentário e decrementa o contador no kanban
  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setCards((prev) => prev.map((c) =>
      c.id === selectedCard.id
        ? { ...c, comment_count: Math.max(0, (c.comment_count || 1) - 1) }
        : c
    ));
  };

  // aprova o conteúdo, recarrega o kanban e fecha o modal
  const handleApprove = async () => {
    setApproveLoading(true);
    await updateCardStatus(selectedCard.id, 'approved');
    const data = await getCardsByClient(clientId);
    setCards(data);
    setApproveLoading(false);
    handleCloseModal();
  };

  // envia o comentário e adiciona-o à lista sem re-fetch
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.message.trim()) return;
    setCommentLoading(true);
    const newComment = await createComment({
      card_id: selectedCard.id,
      client_id: clientId,
      message: commentForm.message,
      type: 'comment',
    });
    // injeta o email do cliente localmente para aparecer sem re-fetch
    setComments((prev) => [...prev, { ...newComment, contact_email: client.contact_email }]);
    setCommentForm({ message: '' });
    setCommentLoading(false);
    // atualiza o comment_count do card no kanban sem re-fetch
    setCards((prev) => prev.map((c) =>
      c.id === selectedCard.id
        ? { ...c, comment_count: (c.comment_count || 0) + 1, last_comment_at: new Date().toISOString() }
        : c
    ));
  };

  // separa os conteúdos nas 3 colunas do kanban
  const inReview  = cards.filter((c) => c.status === 'in_review');
  const approved  = cards.filter((c) => c.status === 'approved');
  const published = cards.filter((c) => c.status === 'published');

  // plataformas únicas para mostrar no cabeçalho
  const platforms = client?.social_networks
    ? client.social_networks.split(',').filter(Boolean)
    : [];

  // normaliza a previsão de métricas da ia — pode vir como string json ou objeto
  const aiMetrics = selectedCard?.ai_metrics_prediction
    ? typeof selectedCard.ai_metrics_prediction === 'string'
      ? JSON.parse(selectedCard.ai_metrics_prediction)
      : selectedCard.ai_metrics_prediction
    : null;

  // mostra estado de carregamento enquanto os dados do cliente chegam
  if (notFound) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '12px' }}>
      <p style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600 }}>Projeto não encontrado.</p>
      <button onClick={() => navigate('/meus-projetos')} style={{ background: 'none', border: 'none', color: '#833AB4', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>← Voltar aos projetos</button>
    </div>
  );
  if (!client) return <div className="agency-dashboard" style={{ padding: '2rem', color: '#94a3b8' }}>A carregar...</div>;

  return (
    <div className="agency-full-layout">
      {/* logo leva para a home, sair também redireciona para a home */}
      <ClientNavbar
        onBrandClick={() => navigate('/')}
        notifications={notifications}
        onNotifClick={(n) => {
            markNotificationRead(n.id);
            setNotifications((prev) => prev.filter((x) => x.id !== n.id));
          }}
      />

      <ClientBoardHeader
        client={client}
        cards={cards}
        inReview={inReview}
        approved={approved}
        published={published}
        platforms={platforms}
        onBack={() => navigate('/meus-projetos')}
      />

      <div className="board-wrapper">
        <div className="board">
          {/* 3 colunas do kanban com os conteúdos do cliente */}
          {[
            { id: 'in_review', label: 'Em revisão', dot: 'dot-review',    items: inReview },
            { id: 'approved',  label: 'Aprovado',   dot: 'dot-approved',  items: approved },
            { id: 'published', label: 'Publicado',  dot: 'dot-published', items: published },
          ].map((col) => (
            <ClientBoardColumn key={col.id} col={col} handleCardClick={handleCardClick} />
          ))}
        </div>
      </div>

      {/* modal de detalhe — só renderiza quando há um conteúdo selecionado */}
      {selectedCard && (
        <ClientCardModal
          selectedCard={selectedCard}
          comments={comments}
          commentForm={commentForm}
          setCommentForm={setCommentForm}
          commentLoading={commentLoading}
          aiMetrics={aiMetrics}
          metrics={metrics}
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
