// barra de navegação superior do dashboard da agência com link para a home e notificações
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AgencyTopnav({ notifications = [], onNotifClick }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unread = notifications.filter((n) => !n.is_read).length;

  // fecha o dropdown ao clicar fora
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => setOpen((prev) => !prev);

  const handleNotifClick = (n) => {
    setOpen(false);
    onNotifClick?.(n);
  };

  return (
    <nav className="agency-topnav">
      <Link to="/" className="agency-topnav__brand">
        <span className="agency-topnav__off">OFF</span>
        <span className="agency-topnav__scroll">SCROLL.</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="notif-bell" ref={ref}>
        <button className="notif-bell__btn" onClick={handleOpen} aria-label="Notificações">
          🔔
          {unread > 0 && <span className="notif-bell__badge">{unread}</span>}
        </button>
        {open && (
          <div className="notif-dropdown notif-dropdown--right">
            <p className="notif-dropdown__title">Notificações</p>
            {unread === 0
              ? <p className="notif-dropdown__empty">Sem notificações novas.</p>
              : notifications.filter((n) => !n.is_read).map((n) => (
                  <div key={n.id} className="notif-item" style={{ cursor: 'pointer' }} onClick={() => handleNotifClick(n)}>
                    <p className="notif-item__msg">{n.message}</p>
                    <p className="notif-item__time">{new Date(n.created_at).toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))
            }
          </div>
        )}
        </div>
        <button className="client-navbar__logout" onClick={() => navigate('/')}>Sair</button>
      </div>
    </nav>
  );
}
