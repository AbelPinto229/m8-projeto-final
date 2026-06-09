import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getClients, getCardsByClient, getCommentsByCard, getMetricsByCard, updateCardStatus, updateCard, createCard, createClient, updateClient, deleteCard, deleteClient, deleteComment, createMetrics, updateMetrics } from '../services/api';
import '../styles/AgencyDashboard.css';

const COLORS = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5'];
const formatNetworks = (str) => str ? str.split(',').map(s => s.trim()).filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ') : '';
const DRAWER_COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#0f172a'];

function AgencyDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedClientColor, setSelectedClientColor] = useState('color-0');
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [comments, setComments] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ title: '', body: '', social_network: 'instagram', scheduled_date: '' });
  const [metricsForm, setMetricsForm] = useState({ reach: '', likes: '', comments_count: '', shares: '', published_at: '' });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createdCard, setCreatedCard] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [clientForm, setClientForm] = useState({ company_name: '', contact_email: '', social_networks: '' });
  const [clientColor, setClientColor] = useState('#6366f1');
  const [statusLoading, setStatusLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [editClientModal, setEditClientModal] = useState(null);
  const [editClientForm, setEditClientForm] = useState({ company_name: '', social_networks: '', status: 'ativo', color: 'color-0' });
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      const data = await getClients();
      setClients(data);
    };
    fetchClients();
  }, []);

  useEffect(() => {
    if (id && clients.length > 0) {
      const client = clients.find((c) => c.id === parseInt(id));
      if (client) {
        const index = clients.indexOf(client);
        setSelectedClient(client);
        setSelectedClientColor(client.color || COLORS[client.id % COLORS.length]);
        getCardsByClient(client.id).then(setCards);
      }
    }
  }, [id, clients]);

  const handleClientClick = (client) => {
    navigate(`/agencia/cliente/${client.id}`);
  };

  const handleBack = () => {
    setSelectedClient(null);
    setCards([]);
    navigate('/agencia');
  };

  const handleOpenEditClient = (e, client) => {
    e.stopPropagation();
    setEditClientForm({
      company_name: client.company_name,
      social_networks: client.social_networks,
      status: client.status || 'ativo',
      color: client.color || '#6366f1',
    });
    setEditClientModal(client);
  };

  const handleEditClientSubmit = async (e) => {
    e.preventDefault();
    await updateClient(editClientModal.id, {
      company_name: editClientForm.company_name,
      contact_email: editClientModal.contact_email || '',
      social_networks: editClientForm.social_networks,
      status: editClientForm.status,
      color: editClientForm.color,
    });
    const data = await getClients();
    setClients(data);
    setEditClientModal(null);
  };

  const handleDeleteClient = async () => {
    await deleteClient(editClientModal.id);
    const data = await getClients();
    setClients(data);
    setShowDeleteConfirmModal(false);
    setEditClientModal(null);
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleMetricsSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      card_id: selectedCard.id,
      reach: metricsForm.reach ? parseInt(metricsForm.reach) : null,
      likes: metricsForm.likes ? parseInt(metricsForm.likes) : null,
      comments_count: metricsForm.comments_count ? parseInt(metricsForm.comments_count) : null,
      shares: metricsForm.shares ? parseInt(metricsForm.shares) : null,
      published_at: metricsForm.published_at || null,
    };
    if (metrics) {
      await updateMetrics(metrics.id, payload);
    } else {
      await createMetrics(payload);
    }
    const updated = await getMetricsByCard(selectedCard.id);
    setMetrics(updated);
  };

  const handleCardClick = async (card) => {
    setSelectedCard(card);
    setActiveTab('details');
    const commentsData = await getCommentsByCard(card.id);
    setComments(commentsData);
    const metricsData = await getMetricsByCard(card.id);
    setMetrics(metricsData);
    if (metricsData) {
      setMetricsForm({
        reach: metricsData.reach ?? '',
        likes: metricsData.likes ?? '',
        comments_count: metricsData.comments_count ?? '',
        shares: metricsData.shares ?? '',
        published_at: metricsData.published_at ? metricsData.published_at.split('T')[0] : '',
      });
    } else {
      setMetricsForm({ reach: '', likes: '', comments_count: '', shares: '', published_at: '' });
    }
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
    setComments([]);
    setMetrics(null);
  };

  const handleOpenCreate = () => {
    setCreatedCard(null);
    setCreateForm({ title: '', body: '', social_network: 'instagram', scheduled_date: '' });
    setImagePreviews([]);
    setShowCreateModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    const result = await createCard({ ...createForm, client_id: selectedClient.id });
    setCreatedCard(result);
    setCreateLoading(false);
    const data = await getCardsByClient(selectedClient.id);
    setCards(data);
  };

  const handleCloseCreate = () => {
    setShowCreateModal(false);
    setCreatedCard(null);
  };

  const handleDeleteCard = async () => {
    await deleteCard(selectedCard.id);
    const data = await getCardsByClient(selectedClient.id);
    setCards(data);
    setShowDeleteConfirm(false);
    handleCloseModal();
  };

  const handleStatusChange = async (status) => {
    setStatusLoading(true);
    try {
      await updateCardStatus(selectedCard.id, status);
      const data = await getCardsByClient(selectedClient.id);
      setCards(data);
      handleCloseModal();
    } catch (err) {
      console.error('Erro ao atualizar estado:', err);
      alert('Erro ao atualizar estado. Tenta novamente.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleEditOpen = () => {
    setEditForm({
      title: selectedCard.title,
      body: selectedCard.body,
      social_network: selectedCard.social_network,
      scheduled_date: selectedCard.scheduled_date?.split('T')[0] || '',
    });
    setEditImagePreviews(selectedCard.image_url ? [selectedCard.image_url] : []);
    setEditMode(true);
  };

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setEditImagePreviews(previews);
  };

  const handleEditSave = async (reanalyse = false) => {
    try {
      const result = await updateCard(selectedCard.id, { ...editForm, reanalyse });
      if (result.error) {
        alert('Erro ao guardar: ' + result.error);
        return;
      }
      const data = await getCardsByClient(selectedClient.id);
      setCards(data);
      setEditMode(false);
      handleCloseModal();
    } catch (err) {
      console.error('Erro ao guardar card:', err);
      alert('Erro ao guardar. Tenta novamente.');
    }
  };

  const handleClientFormSubmit = async (e) => {
    e.preventDefault();
    await createClient({ ...clientForm, color: clientColor });
    const data = await getClients();
    setClients(data);
    setShowNewClientModal(false);
    setClientForm({ company_name: '', contact_email: '', social_networks: '' });
    setClientColor('#6366f1');
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    const newStatus = destination.droppableId;
    const cardId = parseInt(draggableId);
    setCards((prev) => prev.map((c) => c.id === cardId ? { ...c, status: newStatus } : c));
    await updateCardStatus(cardId, newStatus);
  };

  const inReview = cards.filter((c) => c.status === 'in_review');
  const approved = cards.filter((c) => c.status === 'approved');
  const published = cards.filter((c) => c.status === 'published');

  const filteredClients = clients.filter((c) => {
    const matchSearch = c.company_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'todos' || (c.status || 'ativo') === filter;
    return matchSearch && matchFilter;
  });

  const totalClients = clients.length;
  const ativos = clients.filter((c) => (c.status || 'ativo') === 'ativo').length;
  const inativos = clients.filter((c) => c.status === 'inativo').length;

  const platforms = selectedClient?.social_networks
    ? selectedClient.social_networks.split(',').filter(Boolean)
    : [];

  const aiSuggestion = selectedCard?.ai_suggestion
    ? typeof selectedCard.ai_suggestion === 'string'
      ? JSON.parse(selectedCard.ai_suggestion)
      : selectedCard.ai_suggestion
    : null;

  const aiMetrics = selectedCard?.ai_metrics_prediction
    ? typeof selectedCard.ai_metrics_prediction === 'string'
      ? JSON.parse(selectedCard.ai_metrics_prediction)
      : selectedCard.ai_metrics_prediction
    : null;

  if (selectedClient) {
    return (
      <div className="agency-full-layout">
        <nav className="agency-topnav">
          <Link to="/" className="agency-topnav__brand">
            <span className="agency-topnav__off">OFF</span><span className="agency-topnav__scroll">SCROLL.</span>
          </Link>
        </nav>
        <div className="board-header">
          <div className="board-header__top">
            <div className="board-header__left">
              <button className="btn-back" onClick={handleBack}>← Voltar</button>
              <div className={`board-header__avatar ${selectedClientColor}`}>
                {selectedClient.company_name.charAt(0)}
              </div>
              <div className="board-header__info">
                <h1>{selectedClient.company_name}</h1>
                <p>{selectedClient.contact_email}</p>
              </div>
              <span className="board-header__badge">Ativo</span>
            </div>
            <div className="board-header__actions">
              <button className="btn-new" onClick={handleOpenCreate}>+ Novo Conteúdo</button>
            </div>
          </div>
          <div className="board-header__stats">
            <div className="board-header__stat">
              <span className="stat-label">Conteúdos</span>
              <span className="stat-value">{cards.length}</span>
            </div>
            <div className="board-header__stat">
              <span className="stat-label">Plataformas</span>
              <span className="stat-value">{platforms.length}</span>
            </div>
            <div className="board-header__stat">
              <span className="stat-label">Em revisão</span>
              <span className="stat-value">{inReview.length}</span>
            </div>
            <div className="board-header__stat">
              <span className="stat-label">Aprovados</span>
              <span className="stat-value">{approved.length}</span>
            </div>
            <div className="board-header__stat">
              <span className="stat-label">Publicados</span>
              <span className="stat-value">{published.length}</span>
            </div>
            <div className="board-header__stat">
              <span className="stat-label">Redes sociais</span>
              <span className="stat-value">{selectedClient.social_networks}</span>
            </div>
          </div>
        </div>

        <div className="board-wrapper">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="board">
              {[
                { id: 'in_review', label: 'Em revisão', dot: 'dot-review', items: inReview },
                { id: 'approved', label: 'Aprovado', dot: 'dot-approved', items: approved },
                { id: 'published', label: 'Publicado', dot: 'dot-published', items: published },
              ].map((col) => (
                <div key={col.id} className="board__column">
                  <div className="board__column-header">
                    <div className="board__column-header-left">
                      <span className={`board__column-dot ${col.dot}`}></span>
                      <h2>{col.label}</h2>
                    </div>
                    <span className="board__column-count">{col.items.length}</span>
                  </div>
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`board__droppable ${snapshot.isDraggingOver ? 'board__droppable--over' : ''}`}
                      >
                        {col.items.map((card, index) => (
                          <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`board__card ${snapshot.isDragging ? 'board__card--dragging' : ''}`}
                                onClick={() => handleCardClick(card)}
                              >
                                <h3>{card.title}</h3>
                                <span className="board__card__tag">{card.social_network}</span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                </div>
              ))}
            </div>
          </DragDropContext>
        </div>

        {showDeleteConfirm && (
          <div className="modal-overlay" style={{ zIndex: 500 }} onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal modal--confirm" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal__title">Eliminar card</h2>
              <p className="confirm-text">Tens a certeza que queres eliminar <strong>"{selectedCard?.title}"</strong>? Esta ação não pode ser revertida.</p>
              <div className="confirm-actions">
                <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
                <button className="btn-delete-confirm" onClick={handleDeleteCard}>Eliminar</button>
              </div>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="modal-overlay" onClick={handleCloseCreate}>
            <div className="modal modal--create" onClick={(e) => e.stopPropagation()}>
              <button className="modal__close" onClick={handleCloseCreate}>✕</button>
              <h2 className="modal__title">Novo Conteúdo</h2>
              <div className="modal__content">
                <div className="modal__left">
                  <form onSubmit={handleCreateSubmit}>
                    <div className="form-group">
                      <label>Título *</label>
                      <input type="text" placeholder="Título do conteúdo" value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Descrição *</label>
                      <textarea placeholder="Notas, roteiro, referências..." value={createForm.body} onChange={(e) => setCreateForm({ ...createForm, body: e.target.value })} required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Plataforma</label>
                        <select value={createForm.social_network} onChange={(e) => setCreateForm({ ...createForm, social_network: e.target.value })}>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="tiktok">TikTok</option>
                          <option value="linkedin">LinkedIn</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Data limite *</label>
                        <input type="date" value={createForm.scheduled_date} onChange={(e) => setCreateForm({ ...createForm, scheduled_date: e.target.value })} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Imagens</label>
                      <label className="image-upload-area">
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                        <p>📎 Clica para adicionar imagens</p>
                        <span>PNG, JPG, WEBP</span>
                      </label>
                      {imagePreviews.length > 0 && (
                        <div className="image-previews">
                          {imagePreviews.map((src, i) => (
                            <div key={i} className="image-preview">
                              <img src={src} alt="" />
                              <button className="image-preview__remove" onClick={() => handleRemoveImage(i)}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button type="submit" className="btn-new" disabled={createLoading}>
                      {createLoading ? 'A analisar...' : 'Guardar e analisar'}
                    </button>
                  </form>
                </div>
                <div className="modal__right">
                  <div className="card-preview">
                    <p className="card-preview__label">Preview do card</p>
                    <div className="card-preview__box">
                      {imagePreviews.length > 0
                        ? <img src={imagePreviews[0]} alt="preview" className="card-preview__image" />
                        : <div className="card-preview__image-placeholder">📷 Sem imagem</div>
                      }
                      <div className="card-preview__body">
                        <span className="board__card__tag">{createForm.social_network || 'instagram'}</span>
                        <h3>{createForm.title || 'Título do conteúdo'}</h3>
                        <p>{createForm.body || 'Descrição do conteúdo...'}</p>
                        {createForm.scheduled_date && <p className="card-preview__date">📅 {createForm.scheduled_date}</p>}
                      </div>
                    </div>
                  </div>
                  {!createdCard && !createLoading && <p className="ai-placeholder">Clica em "Guardar e analisar" para receber sugestões da IA.</p>}
                  {createLoading && <p className="ai-placeholder">⏳ A analisar conteúdo...</p>}
                  {createdCard?.ai_suggestion && (() => {
                    const ai = typeof createdCard.ai_suggestion === 'string' ? JSON.parse(createdCard.ai_suggestion) : createdCard.ai_suggestion;
                    return (
                      <div className="modal__ai">
                        <h3>Sugestão da IA</h3>
                        <p><strong>Conteúdo melhorado:</strong> {ai.improved_content}</p>
                        <p><strong>Hashtags:</strong> {ai.hashtags?.join(' ')}</p>
                        <p><strong>Melhor horário:</strong> {ai.best_time}</p>
                        <p><strong>Feedback da data:</strong> {ai.date_feedback}</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCard && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal__close" onClick={handleCloseModal}>✕</button>
              <div className="modal__tabs">
                <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>Detalhes</button>
                <button className={activeTab === 'ai' ? 'active' : ''} onClick={() => setActiveTab('ai')}>Sugestão IA</button>
                <button className={activeTab === 'report' ? 'active' : ''} onClick={() => setActiveTab('report')}>Relatório</button>
              </div>

              {activeTab === 'details' && !editMode && (
                <div className="modal__content">
                  <div className="modal__left">
                    <h2>{selectedCard.title}</h2>
                    {selectedCard.image_url && <img src={selectedCard.image_url} alt="card" />}
                    <p>{selectedCard.body}</p>
                    <p><strong>Rede social:</strong> {selectedCard.social_network}</p>
                    <p><strong>Data planeada:</strong> {selectedCard.scheduled_date ? new Date(selectedCard.scheduled_date).toLocaleDateString('pt-PT') : '—'}</p>
                    <div className="modal__actions">
                      {selectedCard.status === 'in_review' && (
                        <button onClick={() => handleStatusChange('approved')} disabled={statusLoading}>
                          {statusLoading ? 'A aprovar...' : 'Aprovar'}
                        </button>
                      )}
                      {selectedCard.status === 'approved' && (
                        <button onClick={() => handleStatusChange('published')} disabled={statusLoading}>
                          {statusLoading ? 'A publicar...' : 'Publicar'}
                        </button>
                      )}
                      <button className="btn-edit" onClick={handleEditOpen}>Editar</button>
                      <button className="btn-delete" onClick={() => setShowDeleteConfirm(true)}>Eliminar</button>
                    </div>
                  </div>
                  <div className="modal__right">
                    <h3>Comentários</h3>
                    {comments.length === 0 && <p>Sem comentários.</p>}
                    {comments.map((comment) => (
                      <div key={comment.id} className="comment" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <p><strong>{comment.type}:</strong> {comment.message}</p>
                        <button onClick={() => handleDeleteComment(comment.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', flexShrink: 0 }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'details' && editMode && (
                <div className="modal__content">
                  <div className="modal__left">
                    <div className="form-group">
                      <label>Título *</label>
                      <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Descrição *</label>
                      <textarea value={editForm.body} onChange={(e) => setEditForm({ ...editForm, body: e.target.value })} />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Plataforma</label>
                        <select value={editForm.social_network} onChange={(e) => setEditForm({ ...editForm, social_network: e.target.value })}>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="tiktok">TikTok</option>
                          <option value="linkedin">LinkedIn</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Data limite</label>
                        <input type="date" value={editForm.scheduled_date} onChange={(e) => setEditForm({ ...editForm, scheduled_date: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Imagem</label>
                      <label className="image-upload-area">
                        <input type="file" accept="image/*" onChange={handleEditImageChange} />
                        <p>📎 Clica para alterar a imagem</p>
                        <span>PNG, JPG, WEBP</span>
                      </label>
                    </div>
                    <div className="modal__actions">
                      <button onClick={() => handleEditSave(false)}>Guardar</button>
                      <button onClick={() => handleEditSave(true)}>Guardar e reanalisar</button>
                      <button className="btn-cancel" onClick={() => setEditMode(false)}>Cancelar</button>
                    </div>
                  </div>
                  <div className="modal__right">
                    <div className="card-preview">
                      <p className="card-preview__label">Preview do card</p>
                      <div className="card-preview__box">
                        {editImagePreviews.length > 0
                          ? <img src={editImagePreviews[0]} alt="preview" className="card-preview__image" />
                          : <div className="card-preview__image-placeholder">📷 Sem imagem</div>
                        }
                        <div className="card-preview__body">
                          <span className="board__card__tag">{editForm.social_network}</span>
                          <h3>{editForm.title}</h3>
                          <p>{editForm.body}</p>
                          {editForm.scheduled_date && <p className="card-preview__date">📅 {editForm.scheduled_date}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="modal__ai-tab">
                  {!aiSuggestion && <p className="ai-placeholder">Sem sugestão da IA para este card.</p>}
                  {aiSuggestion && (
                    <>
                      <div className="ai-section">
                        <h3>Conteúdo melhorado</h3>
                        <p>{aiSuggestion.improved_content}</p>
                      </div>
                      <div className="ai-section">
                        <h3>Hashtags</h3>
                        <div className="ai-hashtags">
                          {aiSuggestion.hashtags?.map((tag, i) => (
                            <span key={i} className="ai-hashtag">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="ai-section">
                        <h3>Melhor horário</h3>
                        <p>{aiSuggestion.best_time}</p>
                      </div>
                      <div className="ai-section">
                        <h3>Feedback da data</h3>
                        <p>{aiSuggestion.date_feedback}</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'report' && (
                <div className="modal__report">
                  {aiMetrics && (
                    <div className="report-section">
                      <p className="report-section__title">Previsão da IA</p>
                      <div className="report-metrics-grid">
                        <div className="report-metric"><span>Alcance</span><strong>{aiMetrics.reach}</strong></div>
                        <div className="report-metric"><span>Likes</span><strong>{aiMetrics.likes}</strong></div>
                        <div className="report-metric"><span>Comentários</span><strong>{aiMetrics.comments}</strong></div>
                        <div className="report-metric"><span>Partilhas</span><strong>{aiMetrics.shares}</strong></div>
                      </div>
                      {aiMetrics.analysis && <p className="report-analysis">{aiMetrics.analysis}</p>}
                    </div>
                  )}

                  <div className="report-section">
                    <p className="report-section__title">Métricas reais</p>
                    <form onSubmit={handleMetricsSubmit} className="report-form">
                      <div className="report-form__grid">
                        <div className="form-group">
                          <label>Alcance</label>
                          <input type="number" min="0" placeholder="0" value={metricsForm.reach} onChange={(e) => setMetricsForm({ ...metricsForm, reach: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <label>Likes</label>
                          <input type="number" min="0" placeholder="0" value={metricsForm.likes} onChange={(e) => setMetricsForm({ ...metricsForm, likes: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <label>Comentários</label>
                          <input type="number" min="0" placeholder="0" value={metricsForm.comments_count} onChange={(e) => setMetricsForm({ ...metricsForm, comments_count: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <label>Partilhas</label>
                          <input type="number" min="0" placeholder="0" value={metricsForm.shares} onChange={(e) => setMetricsForm({ ...metricsForm, shares: e.target.value })} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Data de publicação</label>
                        <input type="date" value={metricsForm.published_at} onChange={(e) => setMetricsForm({ ...metricsForm, published_at: e.target.value })} />
                      </div>
                      <button type="submit" className="report-save-btn">{metrics ? 'Atualizar métricas' : 'Guardar métricas'}</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  const NAV_ITEMS = [
    { label: 'SCROLL' },
    { label: 'BALANCE' },
    { label: 'METRICS' },
    { label: 'EMAIL' },
    { label: 'CALENDAR' },
    { label: 'STRATEGY' },
    { label: 'PROJECT', active: true },
    { label: 'PROPOSALS' },
    { label: 'CEM' },
    { label: 'USERS' },
  ];

  return (
    <div className="agency-full-layout">
        {/* ── Navbar topo ── */}
        <nav className="agency-topnav">
          <Link to="/" className="agency-topnav__brand">
            <span className="agency-topnav__off">OFF</span><span className="agency-topnav__scroll">SCROLL.</span>
          </Link>
        </nav>

        {/* ── Conteúdo principal + sidebar direita ── */}
        <div className="agency-main">
          <div className="clients-page__topbar">
            <input className="clients-search" type="text" placeholder="Pesquisar projetos..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="clients-filters">
              {['todos', 'ativo', 'inativo'].map((f) => (
                <button key={f} className={`clients-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <button className="btn-new" onClick={() => setShowNewClientModal(true)}>+ Novo Projeto</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'start', gap: '24px' }}>
            <div className="clients-grid" style={{ flex: 1 }}>
              {filteredClients.map((client) => {
                const isInativo = client.status === 'inativo';
                const cardColor = client.color || null;
                const fallbackClass = COLORS[client.id % COLORS.length];
                return (
                  <div key={client.id} className={`proj-card${isInativo ? ' proj-card--inactive' : ''}`} onClick={() => handleClientClick(client)}>
                    <div
                      className={`proj-card-banner${isInativo ? ' color-inactive' : cardColor ? '' : ` ${fallbackClass}`}`}
                      style={!isInativo && cardColor ? { background: cardColor } : undefined}
                    >
                      <span className="proj-card-name">{client.company_name}</span>
                      <button className="proj-card-edit-btn" onClick={(e) => handleOpenEditClient(e, client)}>Editar</button>
                      {isInativo && <span className="proj-card-status-tag">Inativo</span>}
                    </div>
                    <div className="proj-card-body">
                      <p className="proj-card-desc">{formatNetworks(client.social_networks)}</p>
                      <div className="proj-card-footer">
                        <div className="proj-card-stats">
                          <span className="proj-stat">📄 0</span>
                          <span className="proj-stat">👥 1</span>
                        </div>
                        <div className="proj-members-stack">
                          <div
                            className={`member-avatar${isInativo ? ' color-inactive' : cardColor ? '' : ` ${fallbackClass}`}`}
                            style={!isInativo && cardColor ? { background: cardColor } : undefined}
                          >{client.company_name.charAt(0)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Sidebar direita ── */}
            <div className="clients-sidebar">
          <div className="sidebar-box">
            <p className="sidebar-label">RESUMO</p>
            <div className="sidebar-item">
              <span className="sidebar-dot dot-blue"></span>
              <span>Total projetos</span>
              <strong>{totalClients}</strong>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-dot dot-green"></span>
              <span>Ativos</span>
              <strong>{ativos}</strong>
            </div>
            <div className="sidebar-item">
              <span className="sidebar-dot dot-gray"></span>
              <span>Inativos</span>
              <strong>{inativos}</strong>
            </div>
          </div>
          <div className="sidebar-box">
            <p className="sidebar-label">POR ESTADO</p>
            <div className="sidebar-progress">
              <div className="sidebar-progress__row"><span>Ativo</span><strong>{ativos}</strong></div>
              <div className="progress-bar"><div className="progress-bar__fill green" style={{ width: totalClients ? `${(ativos / totalClients) * 100}%` : '0%' }}></div></div>
            </div>
            <div className="sidebar-progress">
              <div className="sidebar-progress__row"><span>Inativo</span><strong>{inativos}</strong></div>
              <div className="progress-bar"><div className="progress-bar__fill gray" style={{ width: totalClients ? `${(inativos / totalClients) * 100}%` : '0%' }}></div></div>
            </div>
          </div>
            </div>
          </div>
        </div>

      {editClientModal && (
        <div className="drawer-overlay" onClick={() => setEditClientModal(null)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer__header">
              <h2>Editar Projeto</h2>
              <button className="modal__close" onClick={() => setEditClientModal(null)}>✕</button>
            </div>
            <form className="drawer__form" onSubmit={handleEditClientSubmit}>
              <div className="form-group">
                <label>Nome do projeto *</label>
                <input type="text" value={editClientForm.company_name} onChange={(e) => setEditClientForm({ ...editClientForm, company_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Redes sociais</label>
                <input type="text" placeholder="instagram,facebook,tiktok" value={editClientForm.social_networks} onChange={(e) => setEditClientForm({ ...editClientForm, social_networks: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={editClientForm.status} onChange={(e) => setEditClientForm({ ...editClientForm, status: e.target.value })} style={{ padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', background: '#f8fafc', outline: 'none' }}>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              <div className="form-group">
                <label>Cor do projeto</label>
                <div className="color-picker">
                  {DRAWER_COLORS.map((color) => (
                    <button key={color} type="button" className={`color-dot ${editClientForm.color === color ? 'color-dot--active' : ''}`} style={{ background: color }} onClick={() => setEditClientForm({ ...editClientForm, color })} />
                  ))}
                </div>
              </div>
              <div className="drawer__actions">
                <button type="button" className="btn-cancel" onClick={() => setEditClientModal(null)}>Cancelar</button>
                <button type="submit" className="btn-new">Guardar</button>
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #fee2e2' }}>
                <button type="button" onClick={() => setShowDeleteConfirmModal(true)} style={{ width: '100%', padding: '10px', background: '#fef2f2', color: '#ef4444', border: '1.5px solid #fecaca', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  🗑 Eliminar projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && editClientModal && (
        <div className="confirm-overlay" onClick={() => setShowDeleteConfirmModal(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal__icon">🗑</div>
            <h3 className="confirm-modal__title">Eliminar projeto</h3>
            <p className="confirm-modal__body">
              Tens a certeza que queres eliminar <strong>{editClientModal.company_name}</strong>?<br />
              Esta ação é irreversível.
            </p>
            <div className="confirm-modal__actions">
              <button className="confirm-modal__cancel" onClick={() => setShowDeleteConfirmModal(false)}>Cancelar</button>
              <button className="confirm-modal__confirm" onClick={handleDeleteClient}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {showNewClientModal && (
        <div className="drawer-overlay" onClick={() => setShowNewClientModal(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer__header">
              <h2>Novo Projeto</h2>
              <button className="modal__close" onClick={() => setShowNewClientModal(false)}>✕</button>
            </div>
            <form className="drawer__form" onSubmit={handleClientFormSubmit}>
              <div className="form-group">
                <label>Nome do projeto *</label>
                <input type="text" placeholder="Nome da empresa" value={clientForm.company_name} onChange={(e) => setClientForm({ ...clientForm, company_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email de contacto *</label>
                <input type="email" placeholder="email@empresa.com" value={clientForm.contact_email} onChange={(e) => setClientForm({ ...clientForm, contact_email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Redes sociais *</label>
                <input type="text" placeholder="instagram,facebook,tiktok" value={clientForm.social_networks} onChange={(e) => setClientForm({ ...clientForm, social_networks: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Cor do projeto</label>
                <div className="color-picker">
                  {DRAWER_COLORS.map((color) => (
                    <button key={color} type="button" className={`color-dot ${clientColor === color ? 'color-dot--active' : ''}`} style={{ background: color }} onClick={() => setClientColor(color)} />
                  ))}
                </div>
              </div>
              <div className="drawer__actions">
                <button type="button" className="btn-cancel" onClick={() => setShowNewClientModal(false)}>Cancelar</button>
                <button type="submit" className="btn-new">Criar Projeto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgencyDashboard;
