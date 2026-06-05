import { useEffect, useState } from 'react';
import { getClients, getCardsByClient } from '../services/api';

function AgencyDashboard() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [cards, setCards] = useState([]);

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

  const inReview = cards.filter((c) => c.status === 'in_review');
  const approved = cards.filter((c) => c.status === 'approved');
  const published = cards.filter((c) => c.status === 'published');

  if (selectedClient) {
    return (
      <div className="agency-dashboard">
        <button onClick={handleBack}>← Voltar</button>
        <h1>{selectedClient.company_name}</h1>
        <div className="board">
          <div className="board__column">
            <h2>Em revisão</h2>
            {inReview.map((card) => (
              <div key={card.id} className="board__card">
                <h3>{card.title}</h3>
                <p>{card.social_network}</p>
              </div>
            ))}
          </div>
          <div className="board__column">
            <h2>Aprovado</h2>
            {approved.map((card) => (
              <div key={card.id} className="board__card">
                <h3>{card.title}</h3>
                <p>{card.social_network}</p>
              </div>
            ))}
          </div>
          <div className="board__column">
            <h2>Publicado</h2>
            {published.map((card) => (
              <div key={card.id} className="board__card">
                <h3>{card.title}</h3>
                <p>{card.social_network}</p>
              </div>
            ))}
          </div>
        </div>
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
