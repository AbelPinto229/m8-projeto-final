import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

export default function ForgotPassword() {
  const [email, setEmail]   = useState('');
  const [alert, setAlert]   = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setAlert(null);
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setAlert({ type: res.ok ? 'success' : 'error', msg: data.message || data.error });
    } catch {
      setAlert({ type: 'error', msg: 'Erro de ligação ao servidor.' });
    } finally {
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
          <h2>Recuperar<br />acesso.</h2>
          <p>Introduz o teu email e enviamos-te um link para definires uma nova password.</p>
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
          <Link to="/login" className="auth-home-link">← Voltar ao login</Link>
          <div className="auth-top">
            <h1>Esqueceste a password?</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
              Envia-nos o teu email e receberes um link de recuperação.
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email" id="email"
                placeholder="email@empresa.com" required
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            {alert && (
              <div className={`alert-box alert-${alert.type}`} style={{ display: 'block' }}>
                {alert.msg}
              </div>
            )}

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? <div className="spinner" style={{ display: 'block' }} /> : <span>Enviar link</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
