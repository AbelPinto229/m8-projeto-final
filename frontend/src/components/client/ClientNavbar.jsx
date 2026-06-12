export default function ClientNavbar({ onBrandClick, onLogout }) {
  return (
    <nav className="client-navbar">
      <span
        className="client-navbar__brand"
        style={{ cursor: 'pointer' }}
        onClick={onBrandClick}
      >
        <span className="client-navbar__brand-off">OFF</span>
        <span className="client-navbar__brand-scroll">SCROLL.</span>
      </span>
      <button className="client-navbar__logout" onClick={onLogout}>Sair</button>
    </nav>
  );
}
