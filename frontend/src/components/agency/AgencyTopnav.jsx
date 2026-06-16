// barra de navegação superior do dashboard da agência com link para a home
import { Link } from 'react-router-dom';

export default function AgencyTopnav() {
  return (
    <nav className="agency-topnav">
      <Link to="/" className="agency-topnav__brand">
        <span className="agency-topnav__off">OFF</span>
        <span className="agency-topnav__scroll">SCROLL.</span>
      </Link>
    </nav>
  );
}
