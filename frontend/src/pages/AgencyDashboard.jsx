import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import {
  getClients, getCardsByClient, getCommentsByCard, getMetricsByCard,
  updateCardStatus, updateCard, createCard, createClient, updateClient,
  deleteCard, deleteClient, deleteComment, createMetrics, updateMetrics,
} from '../services/api';
import AgencyTopnav     from '../components/agency/AgencyTopnav';
import BoardHeader      from '../components/agency/BoardHeader';
import BoardColumn      from '../components/agency/BoardColumn';
import CardModal        from '../components/agency/CardModal';
import CreateCardModal  from '../components/agency/CreateCardModal';
import ClientCard       from '../components/agency/ClientCard';
import ClientListTopbar from '../components/agency/ClientListTopbar';
import ClientsSidebar   from '../components/agency/ClientsSidebar';
import EditClientDrawer from '../components/agency/EditClientDrawer';
import NewClientDrawer  from '../components/agency/NewClientDrawer';
import '../styles/AgencyDashboard.css';

const COLORS = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5'];

const VALID_TRANSITIONS = {
  in_review: ['approved'],
  approved:  ['published'],
  published: [],
};

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
    setEditMode(false);
    setEditForm({
      title: card.title || '',
      body: card.body || '',
      social_network: card.social_network || 'instagram',
      scheduled_date: card.scheduled_date ? card.scheduled_date.split('T')[0] : '',
    });
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

  const handleAcceptAISuggestion = () => {
    if (!aiSuggestion) return;
    const hashtags = aiSuggestion.hashtags?.join(' ') || '';
    const newBody = hashtags ? `${aiSuggestion.improved_content}\n\n${hashtags}` : aiSuggestion.improved_content;
    setEditForm({ ...editForm, body: newBody });
    setEditMode(true);
    setActiveTab('details');
  };

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setEditImagePreviews(previews);
  };

  const handleEditSave = async () => {
    try {
      const result = await updateCard(selectedCard.id, editForm);
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

    const fromStatus = source.droppableId;
    const toStatus = destination.droppableId;

    if (!VALID_TRANSITIONS[fromStatus]?.includes(toStatus)) return;

    const cardId = parseInt(draggableId);
    setCards((prev) => prev.map((c) => c.id === cardId ? { ...c, status: toStatus } : c));
    await updateCardStatus(cardId, toStatus);
    const data = await getCardsByClient(selectedClient.id);
    setCards(data);
  };

  const inReview  = cards.filter((c) => c.status === 'in_review');
  const approved  = cards.filter((c) => c.status === 'approved');
  const published = cards.filter((c) => c.status === 'published');

  const filteredClients = clients.filter((c) => {
    const matchSearch = c.company_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'todos' || (c.status || 'ativo') === filter;
    return matchSearch && matchFilter;
  });

  const totalClients = clients.length;
  const ativos   = clients.filter((c) => (c.status || 'ativo') === 'ativo').length;
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
        <AgencyTopnav />
        <BoardHeader
          selectedClient={selectedClient}
          selectedClientColor={selectedClientColor}
          cards={cards}
          inReview={inReview}
          approved={approved}
          published={published}
          platforms={platforms}
          handleBack={handleBack}
          handleOpenCreate={handleOpenCreate}
        />
        <div className="board-wrapper">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="board">
              {[
                { id: 'in_review', label: 'Em revisão', dot: 'dot-review',    items: inReview },
                { id: 'approved',  label: 'Aprovado',   dot: 'dot-approved',  items: approved },
                { id: 'published', label: 'Publicado',  dot: 'dot-published', items: published },
              ].map((col) => (
                <BoardColumn key={col.id} col={col} handleCardClick={handleCardClick} />
              ))}
            </div>
          </DragDropContext>
        </div>
        {selectedCard && (
          <CardModal
            selectedCard={selectedCard}
            comments={comments}
            metrics={metrics}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            editMode={editMode}
            setEditMode={setEditMode}
            editForm={editForm}
            setEditForm={setEditForm}
            editImagePreviews={editImagePreviews}
            metricsForm={metricsForm}
            setMetricsForm={setMetricsForm}
            aiSuggestion={aiSuggestion}
            aiMetrics={aiMetrics}
            statusLoading={statusLoading}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
            handleCloseModal={handleCloseModal}
            handleStatusChange={handleStatusChange}
            handleEditOpen={handleEditOpen}
            handleEditSave={handleEditSave}
            handleEditImageChange={handleEditImageChange}
            handleDeleteComment={handleDeleteComment}
            handleMetricsSubmit={handleMetricsSubmit}
            handleDeleteCard={handleDeleteCard}
            handleAcceptAISuggestion={handleAcceptAISuggestion}
          />
        )}
        {showCreateModal && (
          <CreateCardModal
            createForm={createForm}
            setCreateForm={setCreateForm}
            imagePreviews={imagePreviews}
            createLoading={createLoading}
            createdCard={createdCard}
            handleCloseCreate={handleCloseCreate}
            handleCreateSubmit={handleCreateSubmit}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
          />
        )}
      </div>
    );
  }

  return (
    <div className="agency-full-layout">
      <AgencyTopnav />
      <div className="agency-main">
        <ClientListTopbar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          onNewClient={() => setShowNewClientModal(true)}
        />
        <div style={{ display: 'flex', alignItems: 'start', gap: '24px' }}>
          <div className="clients-grid" style={{ flex: 1 }}>
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                handleClientClick={handleClientClick}
                handleOpenEditClient={handleOpenEditClient}
              />
            ))}
          </div>
          <ClientsSidebar totalClients={totalClients} ativos={ativos} inativos={inativos} />
        </div>
      </div>
      <EditClientDrawer
        editClientModal={editClientModal}
        setEditClientModal={setEditClientModal}
        editClientForm={editClientForm}
        setEditClientForm={setEditClientForm}
        handleEditClientSubmit={handleEditClientSubmit}
        showDeleteConfirmModal={showDeleteConfirmModal}
        setShowDeleteConfirmModal={setShowDeleteConfirmModal}
        handleDeleteClient={handleDeleteClient}
      />
      <NewClientDrawer
        showNewClientModal={showNewClientModal}
        setShowNewClientModal={setShowNewClientModal}
        clientForm={clientForm}
        setClientForm={setClientForm}
        clientColor={clientColor}
        setClientColor={setClientColor}
        handleClientFormSubmit={handleClientFormSubmit}
      />
    </div>
  );
}

export default AgencyDashboard;
