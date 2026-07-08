// ponto de entrada da aplicação — monta o react na div #root do index.html
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

// interceta qualquer 401/403 em toda a app — sessão expirada/inválida faz logout e vai para /login
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const res = await originalFetch(...args);
  if ((res.status === 401 || res.status === 403) && window.location.pathname !== '/login') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('/login');
  }
  return res;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)