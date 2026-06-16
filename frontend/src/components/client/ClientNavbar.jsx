// barra de navegação do dashboard do cliente com logo e botão de sair
export default function ClientNavbar({ onBrandClick, onLogout }) {
  return (
    <nav className="client-navbar">
      {/* clique no logo leva de volta à página inicial */}
      <span
        className="client-navbar__brand"
        style={{ cursor: 'pointer' }}
        onClick={onBrandClick}
      >
        <span className="client-navbar__brand-off">OFF</span>
        <span className="client-navbar__brand-scroll">SCROLL.</span>
      </span>
      {/* sair redireciona para a home */}
      <button className="client-navbar__logout" onClick={onLogout}>Sair</button>
    </nav>
  );
}
