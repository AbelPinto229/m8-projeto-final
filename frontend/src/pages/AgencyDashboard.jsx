import { useEffect, useState } from 'react';
import { getClients, getCardsByClient, getCommentsByCard, getMetricsByCard, updateCardStatus } from '../services/api';

function AgencyDashboard() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [comments, setComments] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchClients = async () => {
      const data = await getClients();
      setClients(data);
    };
    fetchClients();
  }, []);

  const handleClientClick = async (client) => {
    setSelectedClient(client);
    const data = await getCardsByClient(client.id);
    setCards(data);
  };

  const handleBack = () => {
    setSelectedClient(null);
    setCards([]);
  };

  const handleCardClick = async (card) => {
    setSelectedCard(card);
    setActiveTab('details');
    const commentsData = await getCommentsByCard(card.id);
    setComments(commentsData);
    const metricsData = await getMetricsByCard(card.id);
    setMetrics(metricsData);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
    setComments([]);
    setMetrics(null);
  };

  const handleStatusChange = async (status) => {
    await updateCardStatus(selectedCard.id, status);
    const data = await getCardsByClient(selectedClient.id);
    setCards(data);
    handleCloseModal();
  };

  const inReview = cards.filter((c) => c.status === 'in_review');
  const approved = cards.filter((c) => c.status === 'approved');
  const published = cards.filter((c) => c.status === 'published');

  const aiSuggestion = selectedCard?.ai_suggestion
    ? typeof selectedCard.ai_suggestion === 'string'
      ? JSON.parse(selectedCard.ai_suggestion)
      : selectedCard.ai_suggestion
    : null;

  const aiMetrics = selectedCard?.ai_metrics_prediction
    ? typeof selectedCard.ai_metrics_prediction === 'string'
      ? JSON.parse(selectedCard.ai_metrics_prediction)
      : selectedCard.ai_metrics_prediction
    : null;

  if (selectedClient) {
    return (
      <div className="agency-dashboard">
        <button onClick={handleBack}>← Voltar</button>
        <h1>{selectedClient.company_name}</h1>
        <div className="board">
          <div className="board__column">
            <h2>Em revisão</h2>
            {inReview.map((card) => (
              <div key={card.id} className="board__card" onClick={() => handleCardClick(card)}>
                <h3>{card.title}</h3>
                <p>{card.social_network}</p>
              </div>
            ))}
          </div>
          <div className="board__column">
            <h2>Aprovado</h2>
            {approved.map((card) => (
              <div key={card.id} className="board__card" onClick={() => handleCardClick(card)}>
                <h3>{card.title}</h3>
                <p>{card.social_network}</p>
              </div>
            ))}
          </div>
          <div className="board__column">
            <h2>Publicado</h2>
            {published.map((card) => (
              <div key={card.id} className="board__card" onClick={() => handleCardClick(card)}>
                <h3>{card.title}</h3>
                <p>{card.social_network}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedCard && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal__close" onClick={handleCloseModal}>✕</button>

              <div className="modal__tabs">
                <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>Detalhes</button>
                <button className={activeTab === 'report' ? 'active' : ''} onClick={() => setActiveTab('report')}>Relatório</button>
              </div>

              {activeTab === 'details' && (
                <div className="modal__content">
                  <div className="modal__left">
                    <h2>{selectedCard.title}</h2>
                    {selectedCard.image_url && <img src={selectedCard.image_url} alt="card" />}
                    <p>{selectedCard.body}</p>
                    <p><strong>Rede social:</strong> {selectedCard.social_network}</p>
                    <p><strong>Data planeada:</strong> {selectedCard.scheduled_date}</p>

                    {aiSuggestion && (
                      <div className="modal__ai">
                        <h3>Sugestão da IA</h3>
                        <p><strong>Conteúdo melhorado:</strong> {aiSuggestion.improved_content}</p>
                        <p><strong>Hashtags:</strong> {aiSuggestion.hashtags?.join(' ')}</p>
                        <p><strong>Melhor horário:</strong> {aiSuggestion.best_time}</p>
                        <p><strong>Feedback da data:</strong> {aiSuggestion.date_feedback}</p>
                      </div>
                    )}

                    <div className="modal__actions">
                      {selectedCard.status === 'in_review' && (
                        <button onClick={() => handleStatusChange('approved')}>Aprovar</button>
                      )}
                      {selectedCard.status === 'approved' && (
                        <button onClick={() => handleStatusChange('published')}>Publicar</button>
                      )}
                    </div>
                  </div>

                  <div className="modal__right">
                    <h3>Comentários</h3>
                    {comments.length === 0 && <p>Sem comentários.</p>}
                    {comments.map((comment) => (
                      <div key={comment.id} className="comment">
                        <p><strong>{comment.type}:</strong> {comment.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'report' && (
                <div className="modal__report">
                  {aiMetrics && (
                    <div>
                      <h3>Previsão da IA</h3>
                      <p><strong>Alcance:</strong> {aiMetrics.reach}</p>
                      <p><strong>Likes:</strong> {aiMetrics.likes}</p>
                      <p><strong>Comentários:</strong> {aiMetrics.comments}</p>
                      <p><strong>Partilhas:</strong> {aiMetrics.shares}</p>
                      <p><strong>Análise:</strong> {aiMetrics.analysis}</p>
                    </div>
                  )}
                  {metrics && (
                    <div>
                      <h3>Métricas reais</h3>
                      <p><strong>Alcance:</strong> {metrics.reach}</p>
                      <p><strong>Likes:</strong> {metrics.likes}</p>
                      <p><strong>Comentários:</strong> {metrics.comments_count}</p>
                      <p><strong>Partilhas:</strong> {metrics.shares}</p>
                    </div>
                  )}
                  {!aiMetrics && !metrics && <p>Sem dados de relatório.</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="agency-dashboard">
      <h1>Clientes</h1>
      <div className="clients-grid">
        {clients.map((client) => (
          <div key={client.id} className="client-card" onClick={() => handleClientClick(client)}>
            <h2>{client.company_name}</h2>
            <p>{client.contact_email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgencyDashboard;
