// barra de navegação do dashboard do cliente com logo, notificações e botão de sair
import { useState, useRef, useEffect } from 'react';

export default function ClientNavbar({ onBrandClick, onLogout, notifications = [], onMarkRead }) {
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
    <nav className="client-navbar">
      <span className="client-navbar__brand" style={{ cursor: 'pointer' }} onClick={onBrandClick}>
        <span className="client-navbar__brand-off">OFF</span>
        <span className="client-navbar__brand-scroll">SCROLL.</span>
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="notif-bell" ref={ref}>
          <button className="notif-bell__btn" onClick={handleOpen} aria-label="Notificações">
            🔔
            {unread > 0 && <span className="notif-bell__badge">{unread}</span>}
          </button>
          {open && (
            <div className="notif-dropdown notif-dropdown--right">
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
        <button className="client-navbar__logout" onClick={onLogout}>Sair</button>
      </div>
    </nav>
  );
}
