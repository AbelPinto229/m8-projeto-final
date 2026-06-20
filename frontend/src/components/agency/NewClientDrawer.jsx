// drawer lateral para criar um novo cliente/projeto com as credenciais de acesso do cliente
import { useState, useEffect } from 'react';
import { checkEmail } from '../../services/api';

const DRAWER_COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#0f172a'];

export default function NewClientDrawer({
  showNewClientModal,
  setShowNewClientModal,
  clientForm,
  setClientForm,
  clientColor,
  setClientColor,
  handleClientFormSubmit,
  errorMsg = '',
}) {
  const [showPw, setShowPw]       = useState(false);
  const [showPw2, setShowPw2]     = useState(false);
  const [confirm, setConfirm]     = useState('');
  const [pwError, setPwError]     = useState('');
  const [emailExists, setEmailExists] = useState(null);

  useEffect(() => {
    if (showNewClientModal) {
      setEmailExists(null);
      setConfirm('');
      setPwError('');
      setShowPw(false);
      setShowPw2(false);
    }
  }, [showNewClientModal]);

  const handleEmailBlur = async (e) => {
    const email = e.target.value.trim();
    if (!email) return;
    const result = await checkEmail(email);
    setEmailExists(result.exists);
    if (result.exists) {
      setClientForm((prev) => ({ ...prev, password: '' }));
      setConfirm('');
    }
  };

  if (!showNewClientModal) {
    return null;
  }

  return (
    <div className="drawer-overlay" onClick={() => setShowNewClientModal(false)}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a', margin: '24px 0 16px' }}>Novo Projeto</p>
        <form className="drawer__form" onSubmit={(e) => {
          if (!emailExists && clientForm.password !== confirm) {
            e.preventDefault();
            setPwError('As passwords não coincidem.');
            return;
          }
          setPwError('');
          handleClientFormSubmit(e);
        }}>
          <div className="form-group">
            <label>Nome do projeto *</label>
            <input
              type="text"
              placeholder="Nome da empresa"
              value={clientForm.company_name}
              onChange={(e) => setClientForm({ ...clientForm, company_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email de contacto *</label>
            <input
              type="email"
              placeholder="email@empresa.com"
              value={clientForm.contact_email}
              onChange={(e) => { setClientForm({ ...clientForm, contact_email: e.target.value }); setEmailExists(null); }}
              onBlur={handleEmailBlur}
              required
            />
            {emailExists === true && (
              <p style={{ color: '#7c3aed', fontSize: '0.78rem', marginTop: '4px' }}>
                Este email já tem acesso criado — o projeto será associado à conta existente.
              </p>
            )}
          </div>
          {!emailExists && (
            <div className="form-group">
              <label>Nome do cliente</label>
              <input
                type="text"
                placeholder="Nome próprio do cliente"
                value={clientForm.client_name || ''}
                onChange={(e) => setClientForm({ ...clientForm, client_name: e.target.value })}
              />
            </div>
          )}
          {!emailExists && (
            <>
              <div className="form-group">
                <label>Password de acesso do cliente *</label>
                <div className="input-wrap">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Password"
                    value={clientForm.password || ''}
                    onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                    required
                  />
                  <button type="button" className="toggle-pw" onClick={() => setShowPw(s => !s)} aria-label="Mostrar password">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
              <div className="form-group">
                <label>Confirmar Password *</label>
                <div className="input-wrap">
                  <input
                    type={showPw2 ? 'text' : 'password'}
                    placeholder="Repete a password"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setPwError(''); }}
                    required
                  />
                  <button type="button" className="toggle-pw" onClick={() => setShowPw2(s => !s)} aria-label="Mostrar confirmação">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      {showPw2 ? (
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
                {pwError && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px' }}>{pwError}</p>}
              </div>
            </>
          )}
          <div className="form-group">
            <label>Redes sociais *</label>
            <input
              type="text"
              placeholder="instagram,facebook,tiktok"
              value={clientForm.social_networks}
              onChange={(e) => setClientForm({ ...clientForm, social_networks: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Cor do projeto</label>
            <div className="color-picker">
              {DRAWER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-dot ${clientColor === color ? 'color-dot--active' : ''}`}
                  style={{ background: color }}
                  onClick={() => setClientColor(color)}
                />
              ))}
            </div>
          </div>
          {errorMsg && (
            <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: '0 0 12px', padding: '8px 12px', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
              {errorMsg}
            </p>
          )}
          <div className="drawer__actions">
            <button type="button" className="btn-cancel" onClick={() => setShowNewClientModal(false)}>Cancelar</button>
            <button type="submit" className="btn-new">Criar Projeto</button>
          </div>
        </form>
      </div>
    </div>
  );
}
