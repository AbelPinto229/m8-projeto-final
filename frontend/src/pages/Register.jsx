import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../services/api';
import '../styles/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [showPw2, setShowPw2]   = useState(false);
  const [alert, setAlert]       = useState(null);
  const [loading, setLoading]   = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setAlert({ type: 'error', msg: 'As passwords não coincidem.' });
      return;
    }
    setAlert(null);
    setLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', msg: data.error });
      } else {
        setAlert({ type: 'success', msg: 'Conta criada! Redirecionar para o login...' });
        setTimeout(() => navigate('/login', { replace: true }), 1500);
      }
    } catch {
      setAlert({ type: 'error', msg: 'Erro de ligação ao servidor.' });
    } finally {
      setLoading(false);
    }
  }

  const EyeIcon = ({ open }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {open ? (
        <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
      ) : (
        <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
      )}
    </svg>
  );

  return (
    <div className="auth-split">
      <div className="auth-brand">
        <Link to="/" className="brand-logo">
          <span className="logo-off">OFF</span><span className="logo-scroll">scroll.</span>
        </Link>
        <div className="brand-body">
          <h2>Cria a tua<br />conta.</h2>
          <p>Acede à tua área reservada e acompanha os teus conteúdos em tempo real.</p>
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
          <Link to="/login" className="auth-home-link">← Já tenho conta</Link>
          <div className="auth-top">
            <h1>Criar conta</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
              Usa o email que a agência associou ao teu projeto.
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Nome</label>
              <input
                type="text" id="name"
                placeholder="O teu nome" required
                value={name} onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email" id="email"
                placeholder="email@empresa.com" required
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <input
                  type={showPw ? 'text' : 'password'} id="password"
                  placeholder="Cria uma password" required minLength={6}
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPw(s => !s)}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="confirm">Confirmar password</label>
              <div className="input-wrap">
                <input
                  type={showPw2 ? 'text' : 'password'} id="confirm"
                  placeholder="Repete a password" required
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPw2(s => !s)}>
                  <EyeIcon open={showPw2} />
                </button>
              </div>
            </div>

            {alert && (
              <div className={`alert-box alert-${alert.type}`} style={{ display: 'block' }}>
                {alert.msg}
              </div>
            )}

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? <div className="spinner" style={{ display: 'block' }} /> : <span>Criar conta</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
