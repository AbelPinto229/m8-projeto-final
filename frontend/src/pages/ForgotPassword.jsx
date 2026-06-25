import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep]         = useState(1);
  const [email, setEmail]       = useState('');
  const [otp, setOtp]           = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [showPw2, setShowPw2]   = useState(false);
  const [alert, setAlert]       = useState(null);
  const [loading, setLoading]   = useState(false);

  async function onSendCode(e) {
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
      if (!res.ok) {
        setAlert({ type: 'error', msg: data.error });
      } else {
        setAlert({ type: 'success', msg: data.message });
        setStep(2);
      }
    } catch {
      setAlert({ type: 'error', msg: 'Erro de ligação ao servidor.' });
    } finally {
      setLoading(false);
    }
  }

  async function onResetPassword(e) {
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
        body: JSON.stringify({ otp, password }),
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
          <h2>Recuperar<br />acesso.</h2>
          <p>
            {step === 1
              ? 'Introduz o teu email e enviamos-te um código de 6 dígitos.'
              : 'Introduz o código que recebeste no email e define a tua nova password.'}
          </p>
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

          {step === 1 ? (
            <>
              <div className="auth-top">
                <h1>Esqueceste a password?</h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
                  Vamos enviar um código de 6 dígitos para o teu email.
                </p>
              </div>
              <form onSubmit={onSendCode} noValidate>
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
                  {loading ? <div className="spinner" style={{ display: 'block' }} /> : <span>Enviar código</span>}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="auth-top">
                <h1>Introduz o código</h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
                  Enviámos um código para <strong>{email}</strong>. Expira em 10 minutos.
                </p>
              </div>
              <form onSubmit={onResetPassword} noValidate>
                <div className="field">
                  <label htmlFor="otp">Código de verificação</label>
                  <input
                    type="text" id="otp"
                    placeholder="000000" required maxLength={6}
                    style={{ letterSpacing: '8px', fontSize: '1.5rem', textAlign: 'center', fontWeight: 700 }}
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div className="field">
                  <label htmlFor="password">Nova password</label>
                  <div className="input-wrap">
                    <input
                      type={showPw ? 'text' : 'password'} id="password"
                      placeholder="Nova password" required minLength={6}
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
                  {loading ? <div className="spinner" style={{ display: 'block' }} /> : <span>Guardar password</span>}
                </button>
                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.88rem', color: '#64748b' }}>
                  Não recebeste o código?{' '}
                  <button
                    type="button"
                    onClick={() => { setStep(1); setAlert(null); setOtp(''); }}
                    style={{ background: 'none', border: 'none', color: '#833AB4', fontWeight: 600, cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
                  >
                    Reenviar
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
