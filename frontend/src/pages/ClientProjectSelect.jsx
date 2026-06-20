import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyClients } from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import ClientNavbar from '../components/client/ClientNavbar';
import ClientCard   from '../components/agency/ClientCard';
import '../styles/AgencyDashboard.css';

export default function ClientProjectSelect() {
  const navigate        = useNavigate();
  const { user }        = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (user?.role !== 'client') {
      navigate('/agencia', { replace: true });
      return;
    }

    const load = () => {
      getMyClients().then((data) => {
        if (!Array.isArray(data)) return;
        const active = data.filter((p) => p.status !== 'inativo');
        if (active.length === 1) {
          navigate(`/cliente/${active[0].id}`, { replace: true });
          return;
        }
        setProjects(active);
        setLoading(false);
      });
    };

    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (loading) return null;

  return (
    <div className="agency-full-layout">
      <ClientNavbar notifications={[]} />

      <div className="agency-main">
        <h2 style={{ margin: '0 0 20px', fontSize: '2rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
          Olá, <span style={{ background: 'linear-gradient(90deg, #a855f7, #ec4899, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {user?.name ?? 'Cliente'}.
          </span>
        </h2>
        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.95rem' }}>Escolhe o projeto que queres ver.</p>

        <div className="clients-grid">
          {projects.map((p) => (
            <ClientCard
              key={p.id}
              client={p}
              showEdit={false}
              showStatus={false}
              handleClientClick={() => navigate(`/cliente/${p.id}`)}
              handleOpenEditClient={() => {}}
            />
          ))}
        </div>

        {projects.length === 0 && (
          <p style={{ color: '#94a3b8' }}>Não tens projetos associados a esta conta.</p>
        )}
      </div>
    </div>
  );
}
