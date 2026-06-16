// formulário de contacto com validação de campos e envio para a api
import { useState } from 'react';
import { submitContact } from '../../services/api';

export default function Contacto() {
  // valores dos campos do formulário
  const [form, setForm]           = useState({ nome: '', email: '', servico: '', mensagem: '' });
  // true enquanto o pedido à api está em curso — desativa o botão de enviar
  const [busy, setBusy]           = useState(false);
  // true por 5 segundos após envio com sucesso — mostra mensagem de confirmação
  const [okShown, setOkShown]     = useState(false);
  // set com os nomes dos campos obrigatórios que estão vazios — usados para borda vermelha
  const [errFields, setErrFields] = useState(new Set());

  // atualiza um campo e remove o erro desse campo se existia
  function update(k, v) {
    setForm(f => ({ ...f, [k]: v }));
    if (errFields.has(k)) {
      const next = new Set(errFields); next.delete(k); setErrFields(next);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    // valida campos obrigatórios 
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
      // esconde a mensagem de sucesso após 5 segundos
      setTimeout(() => setOkShown(false), 5000);
    } catch {
      alert('Erro ao enviar a mensagem. Tenta novamente.');
    } finally {
      setBusy(false);
    }
  }

  // retorna estilo de borda vermelha se o campo tiver erro, ou undefined caso contrário
  function fieldStyle(name) {
    return errFields.has(name) ? { borderColor: '#c0392b' } : undefined;
  }

  return (
    <section className="section contacto" id="contacto">
      <div className="container">
        <div className="ct-grid">
          {/* lado esquerdo com texto e contactos diretos */}
          <div className="ct-left">
            <p className="label r">Vamos conversar</p>
            <h2 className="sec-title r">Pronto para fazer<br />algo <em>incrível?</em></h2>
            <p className="r">Conta-nos o teu projeto.<br />Respondemos em menos de 24 horas.</p>
            <div className="ct-info r">
              <a href="mailto:geral@offscroll.pt" className="ct-link">✉ geral@offscroll.pt</a>
              <a href="https://www.instagram.com/offscroll.agency/" target="_blank" rel="noreferrer" className="ct-link">◎ @offscroll.agency</a>
            </div>
          </div>
          {/* lado direito com o formulário */}
          <div className="ct-right r">
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="form-row">
                <div className="field">
                  <label>Nome *</label>
                  {/* fieldStyle aplica borda vermelha se o campo estiver em erro */}
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
              {/* botão desativado enquanto o pedido está em curso */}
              <button type="submit" className="btn-submit" disabled={busy}>
                <span>{busy ? 'A enviar...' : 'Enviar mensagem'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              {/* mensagem de sucesso visível durante 5 segundos */}
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
