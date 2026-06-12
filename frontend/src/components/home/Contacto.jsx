import { useState } from 'react';
import { submitContact } from '../../services/api';

export default function Contacto() {
  const [form, setForm]           = useState({ nome: '', email: '', servico: '', mensagem: '' });
  const [busy, setBusy]           = useState(false);
  const [okShown, setOkShown]     = useState(false);
  const [errFields, setErrFields] = useState(new Set());

  function update(k, v) {
    setForm(f => ({ ...f, [k]: v }));
    if (errFields.has(k)) {
      const next = new Set(errFields); next.delete(k); setErrFields(next);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const errs = new Set();
    if (!form.nome.trim())     errs.add('nome');
    if (!form.email.trim())    errs.add('email');
    if (!form.mensagem.trim()) errs.add('mensagem');
    if (errs.size) { setErrFields(errs); return; }

    setBusy(true);
    try {
      await submitContact(form);
      setForm({ nome: '', email: '', servico: '', mensagem: '' });
      setOkShown(true);
      setTimeout(() => setOkShown(false), 5000);
    } catch {
      alert('Erro ao enviar a mensagem. Tenta novamente.');
    } finally {
      setBusy(false);
    }
  }

  function fieldStyle(name) {
    return errFields.has(name) ? { borderColor: '#c0392b' } : undefined;
  }

  return (
    <section className="section contacto" id="contacto">
      <div className="container">
        <div className="ct-grid">
          <div className="ct-left">
            <p className="label r">Vamos conversar</p>
            <h2 className="sec-title r">Pronto para fazer<br />algo <em>incrível?</em></h2>
            <p className="r">Conta-nos o teu projeto.<br />Respondemos em menos de 24 horas.</p>
            <div className="ct-info r">
              <a href="mailto:geral@offscroll.pt" className="ct-link">✉ geral@offscroll.pt</a>
              <a href="https://www.instagram.com/offscroll.agency/" target="_blank" rel="noreferrer" className="ct-link">◎ @offscroll.agency</a>
            </div>
          </div>
          <div className="ct-right r">
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="form-row">
                <div className="field">
                  <label>Nome *</label>
                  <input type="text" placeholder="O teu nome" required style={fieldStyle('nome')}
                    value={form.nome} onChange={e => update('nome', e.target.value)} />
                </div>
                <div className="field">
                  <label>Email *</label>
                  <input type="email" placeholder="email@exemplo.com" required style={fieldStyle('email')}
                    value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Serviço de interesse</label>
                <select value={form.servico} onChange={e => update('servico', e.target.value)}>
                  <option value="">Seleciona um serviço</option>
                  <option>Gestão de Redes Sociais</option>
                  <option>Criação de Conteúdo</option>
                  <option>Marketing Imobiliário</option>
                  <option>Estratégia Digital</option>
                  <option>Outro</option>
                </select>
              </div>
              <div className="field">
                <label>Mensagem *</label>
                <textarea rows={5} placeholder="Conta-nos sobre o teu projeto..." required style={fieldStyle('mensagem')}
                  value={form.mensagem} onChange={e => update('mensagem', e.target.value)} />
              </div>
              <button type="submit" className="btn-submit" disabled={busy}>
                <span>{busy ? 'A enviar...' : 'Enviar mensagem'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              {okShown && (
                <div className="form-ok" style={{ display: 'block' }}>✓ Mensagem enviada! Falamos em breve.</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
