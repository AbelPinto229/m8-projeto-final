import { useEffect, useState } from 'react';
import { getClients } from '../services/api';

function AgencyDashboard() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      const data = await getClients();
      setClients(data);
    };
    fetchClients();
  }, []);

  return (
    <div className="agency-dashboard">
      <h1>Clientes</h1>
      <div className="clients-grid">
        {clients.map((client) => (
          <div key={client.id} className="client-card">
            <h2>{client.company_name}</h2>
            <p>{client.contact_email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgencyDashboard;
