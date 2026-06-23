import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();

  // busca a função login e o user atual do AuthContext
  // login → guarda token e user no localStorage
  // user  → dados do utilizador autenticado (null se não estiver logado)
  const { user, login } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [alert, setAlert]       = useState(null);
  const [loading, setLoading]   = useState(false);

  // se já existir um user no localStorage (sessão ativa), redireciona diretamente
  // evita que um utilizador já autenticado veja a página de login
  useEffect(() => {
    if (user) {
      const dest = user.role === 'client' ? '/meus-projetos' : '/agencia';
      navigate(dest, { replace: true });
    }
  }, [user, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      // envia email e password no body para o backend — POST /api/auth/login
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // recebe o que o backend respondeu: { token, message, user }
      const data = await res.json();

      // se o backend devolveu erro (401 credenciais inválidas, 400 campos em falta)
      if (!res.ok) {
        setAlert({ type: 'error', msg: data.error || data.message || 'Erro ao entrar.' });
        setLoading(false);
        return;
      }

      // login com sucesso — guarda o token e o user no localStorage via AuthContext
      login(data.token, data.user);

      // mostra o alert verde com a mensagem de sucesso do backend
      setAlert({ type: 'success', msg: data.message || 'Sucesso!' });

      // redireciona para a dashboard correta conforme o role do utilizador
      // client → /cliente/:id  |  agency → /agencia
      const dest = data.user?.role === 'client' ? '/meus-projetos' : '/agencia';

      // aguarda 500ms para o utilizador ver o alert verde antes de navegar
      setTimeout(() => navigate(dest, { replace: true }), 500);
    } catch {
      // erro de rede — servidor offline ou sem ligação
      setAlert({ type: 'error', msg: 'Erro de ligação ao servidor.' });
      setLoading(false);
    }
  }

  return (
    <div className="auth-split">
      <div className="auth-brand">
        <Link to="/" className="brand-logo">
          <span className="logo-off">OFF</span><span className="logo-scroll">scroll.</span>
        </Link>
        <div className="brand-body">
          <h2>Bem-vindo<br />de volta.</h2>
          <p>A tua área reservada com métricas, relatórios e tudo o que precisas para gerir o teu negócio.</p>
        </div>
        <div className="brand-footer">
          <span>© 2025 OffScroll</span>
          <a href="https://www.instagram.com/offscrollmarketing.pt/" target="_blank" rel="noreferrer">Instagram →</a>
        </div>
        <div className="brand-blob b1" />
        <div className="brand-blob b2" />
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form-inner">
          <Link to="/" className="auth-home-link">← Voltar ao início</Link>
          <div className="auth-top">
            <h1>Entrar</h1>
          </div>

          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email" id="email" name="email"
                placeholder="email@empresa.com" autoComplete="email" required
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <input
                  type={showPw ? 'text' : 'password'} id="password" name="password"
                  placeholder="A tua password" autoComplete="current-password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                {/* botão para mostrar/esconder a password */}
                <button type="button" className="toggle-pw" onClick={() => setShowPw(s => !s)} aria-label="Mostrar password">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    {showPw ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* alert de erro (vermelho) ou sucesso (verde) */}
            {alert && (
              <div className={`alert-box alert-${alert.type}`} style={{ display: 'block' }}>
                {alert.msg}
              </div>
            )}

            {/* botão desativado enquanto o pedido está em curso — mostra spinner */}
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? <div className="spinner" style={{ display: 'block' }} /> : <span>Entrar</span>}
            </button>

            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.88rem', color: '#64748b' }}>
              <Link to="/esqueci-password" style={{ color: '#833AB4', fontWeight: 600, textDecoration: 'none' }}>
                Esqueceste a password?
              </Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
