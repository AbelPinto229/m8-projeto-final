// barra de navegação superior do dashboard da agência com link para a home e notificações
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AgencyTopnav({ notifications = [], onMarkRead }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unread = notifications.filter((n) => !n.is_read).length;

  // fecha o dropdown ao clicar fora
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open && unread > 0) onMarkRead?.();
  };

  return (
    <nav className="agency-topnav">
      <Link to="/" className="agency-topnav__brand">
        <span className="agency-topnav__off">OFF</span>
        <span className="agency-topnav__scroll">SCROLL.</span>
      </Link>
      <div className="notif-bell" ref={ref}>
        <button className="notif-bell__btn" onClick={handleOpen} aria-label="Notificações">
          🔔
          {unread > 0 && <span className="notif-bell__badge">{unread}</span>}
        </button>
        {open && (
          <div className="notif-dropdown">
            <p className="notif-dropdown__title">Notificações</p>
            {notifications.length === 0
              ? <p className="notif-dropdown__empty">Sem notificações.</p>
              : notifications.map((n) => (
                  <div key={n.id} className={`notif-item ${n.is_read ? 'notif-item--read' : ''}`}>
                    <p className="notif-item__msg">{n.message}</p>
                    <p className="notif-item__time">{new Date(n.created_at).toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))
            }
          </div>
        )}
      </div>
    </nav>
  );
}
