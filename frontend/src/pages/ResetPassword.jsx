import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function ResetPassword() {
  const [searchParams]          = useSearchParams();
  const navigate                = useNavigate();
  const token                   = searchParams.get('token');
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
      const res  = await fetch('http://localhost:5000/api/auth/reset-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', msg: data.error });
      } else {
        setAlert({ type: 'success', msg: data.message });
        setTimeout(() => navigate('/login', { replace: true }), 1500);
      }
    } catch {
      setAlert({ type: 'error', msg: 'Erro de ligação ao servidor.' });
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="auth-split">
        <div className="auth-brand">
          <Link to="/" className="brand-logo">
            <span className="logo-off">OFF</span><span className="logo-scroll">scroll.</span>
          </Link>
          <div className="brand-blob b1" /><div className="brand-blob b2" />
        </div>
        <div className="auth-form-wrap">
          <div className="auth-form-inner">
            <div className="alert-box alert-error" style={{ display: 'block' }}>
              Link inválido. <Link to="/esqueci-password" style={{ color: '#ef4444', fontWeight: 700 }}>Pede um novo.</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-split">
      <div className="auth-brand">
        <Link to="/" className="brand-logo">
          <span className="logo-off">OFF</span><span className="logo-scroll">scroll.</span>
        </Link>
        <div className="brand-body">
          <h2>Nova<br />password.</h2>
          <p>Escolhe uma password segura para a tua conta.</p>
        </div>
        <div className="brand-footer">
          <span>© 2025 OffScroll</span>
        </div>
        <div className="brand-blob b1" />
        <div className="brand-blob b2" />
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form-inner">
          <Link to="/login" className="auth-home-link">← Voltar ao login</Link>
          <div className="auth-top">
            <h1>Redefinir password</h1>
          </div>

          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="password">Nova password</label>
              <div className="input-wrap">
                <input
                  type={showPw ? 'text' : 'password'} id="password"
                  placeholder="Nova password" required minLength={6}
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPw(s => !s)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    {showPw ? (
                      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                    ) : (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                    )}
                  </svg>
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    {showPw2 ? (
                      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                    ) : (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {alert && (
              <div className={`alert-box alert-${alert.type}`} style={{ display: 'block' }}>
                {alert.msg}
              </div>
            )}

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? <div className="spinner" style={{ display: 'block' }} /> : <span>Guardar password</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
