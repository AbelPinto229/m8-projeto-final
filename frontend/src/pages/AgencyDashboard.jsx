// página principal do dashboard da agência — gere clientes, conteúdos, comentários e métricas
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getClients, getCardsByClient, getCommentsByCard, getMetricsByCard,
  updateCardStatus, updateCard, createCard, createClient, updateClient,
  deleteCard, deleteClient, deleteComment, createComment, createMetrics, updateMetrics,
  getNotificationsForAgency, markNotificationsRead,
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
import '../styles/ClientDashboard.css';

// cores de fallback para clientes sem cor definida — atribuídas por id
const COLORS = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5'];

function AgencyDashboard() {
  const navigate = useNavigate();
  // id vem da url quando um cliente está selecionado (/agencia/cliente/:id)
  const { id } = useParams();

  // lista completa de clientes carregada da api
  const [clients, setClients] = useState([]);
  // cliente aberto no kanban
  const [selectedClient, setSelectedClient] = useState(null);
  // classe de cor do cliente selecionado para o avatar
  const [selectedClientColor, setSelectedClientColor] = useState('color-0');
  // conteúdos do cliente selecionado
  const [cards, setCards] = useState([]);
  // conteúdo aberto no modal de detalhe
  const [selectedCard, setSelectedCard] = useState(null);
  // comentários do conteúdo aberto
  const [comments, setComments] = useState([]);
  // métricas reais do conteúdo aberto (pode ser null se ainda não foram registadas)
  const [metrics, setMetrics] = useState(null);
  // aba ativa no modal de detalhe: 'details' | 'ai' | 'report'
  const [activeTab, setActiveTab] = useState('details');
  // controla visibilidade do modal de criação de conteúdo
  const [showCreateModal, setShowCreateModal] = useState(false);
  // dados do formulário de criação de conteúdo
  const [createForm, setCreateForm] = useState({ title: '', body: '', social_network: 'instagram', scheduled_date: '', review_deadline: '' });
  // dados do formulário de métricas reais
  const [metricsForm, setMetricsForm] = useState({ reach: '', likes: '', comments_count: '', shares: '', published_at: '' });
  // urls de preview das imagens selecionadas no formulário de criação
  const [imagePreviews, setImagePreviews] = useState([]);
  // true enquanto a api está a criar o conteúdo e a ia a processar
  const [createLoading, setCreateLoading] = useState(false);
  // resultado da criação com a sugestão da ia incluída
  const [createdCard, setCreatedCard] = useState(null);
  // texto de pesquisa da lista de clientes
  const [search, setSearch] = useState('');
  // filtro de estado: 'todos' | 'ativo' | 'inativo'
  const [filter, setFilter] = useState('todos');
  // controla visibilidade do drawer de criação de cliente
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  // dados do formulário de novo cliente
  const [clientForm, setClientForm] = useState({ company_name: '', contact_email: '', social_networks: '' });
  // cor selecionada para o novo cliente
  const [clientColor, setClientColor] = useState('#6366f1');
  // true enquanto a mudança de estado do conteúdo está a ser processada
  const [statusLoading, setStatusLoading] = useState(false);
  // controla visibilidade do modal de confirmação de eliminação de conteúdo
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // true quando o modal de detalhe está em modo de edição
  const [editMode, setEditMode] = useState(false);
  // dados do formulário de edição de conteúdo
  const [editForm, setEditForm] = useState({});
  // urls de preview da imagem de edição
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  // cliente aberto no drawer de edição (null = drawer fechado)
  const [editClientModal, setEditClientModal] = useState(null);
  // dados do formulário de edição de cliente
  const [editClientForm, setEditClientForm] = useState({ company_name: '', social_networks: '', status: 'ativo', color: 'color-0' });
  // controla visibilidade do modal de confirmação de eliminação de cliente
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  // texto do campo de comentário da agência no modal de detalhe
  const [agencyCommentText, setAgencyCommentText] = useState('');
  // true enquanto o comentário da agência está a ser enviado
  const [agencyCommentLoading, setAgencyCommentLoading] = useState(false);

  // carrega todos os clientes quando o componente monta
  useEffect(() => {
    const fetchClients = async () => {
      const data = await getClients();
      setClients(data);
    };
    fetchClients();
  }, []);

  // quando a url tem um id e os clientes já foram carregados, abre o cliente correspondente
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

  // polling a cada 2s para refletir aprovações e alterações do cliente sem refresh
  useEffect(() => {
    if (!id) return;
    const clientId = parseInt(id);
    const interval = setInterval(() => {
      getCardsByClient(clientId).then(setCards);
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);

  // navega para o kanban do cliente alterando a url
  const handleClientClick = (client) => {
    navigate(`/agencia/cliente/${client.id}`);
  };

  // volta à lista de clientes
  const handleBack = () => {
    setSelectedClient(null);
    setCards([]);
    navigate('/agencia');
  };

  // abre o drawer de edição pré-preenchido com os dados do cliente
  // stopPropagation para não abrir o kanban ao clicar em editar
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

  // submete as alterações do cliente e atualiza a lista
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

  // elimina o cliente e fecha o drawer
  const handleDeleteClient = async () => {
    await deleteClient(editClientModal.id);
    const data = await getClients();
    setClients(data);
    setShowDeleteConfirmModal(false);
    setEditClientModal(null);
  };

  // elimina um comentário e decrementa o contador no kanban
  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setCards((prev) => prev.map((c) =>
      c.id === selectedCard.id
        ? { ...c, comment_count: Math.max(0, (c.comment_count || 1) - 1) }
        : c
    ));
  };

  // envia feedback da agência como comentário — aparece no lado do cliente com o remetente "Agência"
  const handleAgencyCommentSubmit = async (e) => {
    e.preventDefault();
    if (!agencyCommentText.trim()) return;
    setAgencyCommentLoading(true);
    try {
      const newComment = await createComment({
        card_id: selectedCard.id,
        client_id: selectedCard.client_id,
        message: agencyCommentText,
        type: 'comment',
        contact_email: 'Agência',
      });
      if (newComment.error) {
        alert('Erro ao enviar comentário: ' + newComment.error);
        return;
      }
      // injeta o contact_email localmente para aparecer sem re-fetch
      setComments((prev) => [...prev, { ...newComment, contact_email: 'Agência' }]);
      setAgencyCommentText('');
      setCards((prev) => prev.map((c) =>
        c.id === selectedCard.id
          ? { ...c, comment_count: (c.comment_count || 0) + 1, last_comment_at: new Date().toISOString() }
          : c
      ));
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
      alert('Erro ao enviar comentário. Tenta novamente.');
    } finally {
      setAgencyCommentLoading(false);
    }
  };

  // guarda ou atualiza as métricas reais do conteúdo
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
    // usa update se já existem métricas, create se é a primeira vez
    if (metrics) {
      await updateMetrics(metrics.id, payload);
    } else {
      await createMetrics(payload);
    }
    const updated = await getMetricsByCard(selectedCard.id);
    setMetrics(updated);
  };

  // abre o modal de detalhe e carrega comentários e métricas do conteúdo
  const handleCardClick = async (card) => {
    setSelectedCard(card);
    setActiveTab('details');
    setEditMode(false);
    setEditForm({
      title: card.title || '',
      body: card.body || '',
      social_network: card.social_network || 'instagram',
      // remove a parte de tempo da data para o input type="date"
      scheduled_date: card.scheduled_date ? card.scheduled_date.split('T')[0] : '',
      review_deadline: card.review_deadline ? card.review_deadline.split('T')[0] : '',
    });
    const commentsData = await getCommentsByCard(card.id);
    setComments(commentsData);
    const metricsData = await getMetricsByCard(card.id);
    setMetrics(metricsData);
    // pré-preenche o formulário de métricas se já existirem dados
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

  // fecha o modal e limpa os dados do conteúdo selecionado
  const handleCloseModal = () => {
    setSelectedCard(null);
    setComments([]);
    setMetrics(null);
    setAgencyCommentText('');
  };

  // abre o modal de criação limpo
  const handleOpenCreate = () => {
    setCreatedCard(null);
    setCreateForm({ title: '', body: '', social_network: 'instagram', scheduled_date: '', review_deadline: '' });
    setImagePreviews([]);
    setShowCreateModal(true);
  };

  // adiciona as imagens selecionadas às existentes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  // remove uma imagem da lista de previews pelo índice
  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // cria o conteúdo na api e recebe o resultado com a sugestão da ia
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    const result = await createCard({ ...createForm, client_id: selectedClient.id });
    setCreatedCard(result);
    setCreateLoading(false);
    const data = await getCardsByClient(selectedClient.id);
    setCards(data);
  };

  // fecha o modal de criação e limpa o resultado da ia
  const handleCloseCreate = () => {
    setShowCreateModal(false);
    setCreatedCard(null);
  };

  // elimina o conteúdo, recarrega o kanban e fecha o modal
  const handleDeleteCard = async () => {
    await deleteCard(selectedCard.id);
    const data = await getCardsByClient(selectedClient.id);
    setCards(data);
    setShowDeleteConfirm(false);
    handleCloseModal();
  };

  // muda o estado do conteúdo (approved → published) e recarrega o kanban
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

  // entra no modo de edição pré-preenchendo o formulário com os dados atuais do conteúdo
  const handleEditOpen = () => {
    setEditForm({
      title: selectedCard.title,
      body: selectedCard.body,
      social_network: selectedCard.social_network,
      scheduled_date: selectedCard.scheduled_date?.split('T')[0] || '',
      review_deadline: selectedCard.review_deadline?.split('T')[0] || '',
    });
    setEditImagePreviews(selectedCard.image_url ? [selectedCard.image_url] : []);
    setEditMode(true);
  };

  // aceita a sugestão da ia copiando o conteúdo melhorado e hashtags para o formulário de edição
  const handleAcceptAISuggestion = () => {
    if (!aiSuggestion) return;
    const hashtags = aiSuggestion.hashtags?.join(' ') || '';
    const newBody = hashtags ? `${aiSuggestion.improved_content}\n\n${hashtags}` : aiSuggestion.improved_content;
    setEditForm({ ...editForm, body: newBody });
    setEditMode(true);
    setActiveTab('details');
  };

  // atualiza o preview da imagem de edição
  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setEditImagePreviews(previews);
  };

  // guarda as alterações do conteúdo na api e fecha o modal
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

  // cria o cliente, recarrega a lista e fecha o drawer
  const handleClientFormSubmit = async (e) => {
    e.preventDefault();
    await createClient({ ...clientForm, color: clientColor });
    const data = await getClients();
    setClients(data);
    setShowNewClientModal(false);
    setClientForm({ company_name: '', contact_email: '', social_networks: '' });
    setClientColor('#6366f1');
  };

  // separa os conteúdos nas 3 colunas do kanban
  const inReview  = cards.filter((c) => c.status === 'in_review');
  const approved  = cards.filter((c) => c.status === 'approved');
  const published = cards.filter((c) => c.status === 'published');

  // filtra a lista de clientes com base na pesquisa e no filtro de estado
  const filteredClients = clients.filter((c) => {
    const matchSearch = c.company_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'todos' || (c.status || 'ativo') === filter;
    return matchSearch && matchFilter;
  });

  // contagens para a sidebar de resumo
  const totalClients = clients.length;
  const ativos   = clients.filter((c) => (c.status || 'ativo') === 'ativo').length;
  const inativos = clients.filter((c) => c.status === 'inativo').length;

  // plataformas do cliente selecionado para o cabeçalho do kanban
  const platforms = selectedClient?.social_networks
    ? selectedClient.social_networks.split(',').filter(Boolean)
    : [];

  // normaliza a sugestão da ia — pode vir como string json ou objeto
  const aiSuggestion = selectedCard?.ai_suggestion
    ? typeof selectedCard.ai_suggestion === 'string'
      ? JSON.parse(selectedCard.ai_suggestion)
      : selectedCard.ai_suggestion
    : null;

  // normaliza a previsão de métricas da ia — pode vir como string json ou objeto
  const aiMetrics = selectedCard?.ai_metrics_prediction
    ? typeof selectedCard.ai_metrics_prediction === 'string'
      ? JSON.parse(selectedCard.ai_metrics_prediction)
      : selectedCard.ai_metrics_prediction
    : null;

  // vista do kanban quando um cliente está selecionado
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
          <div className="board">
            {/* 3 colunas do kanban com os conteúdos separados por estado */}
            {[
              { id: 'in_review', label: 'Em revisão', dot: 'dot-review',    items: inReview },
              { id: 'approved',  label: 'Aprovado',   dot: 'dot-approved',  items: approved },
              { id: 'published', label: 'Publicado',  dot: 'dot-published', items: published },
            ].map((col) => (
              <BoardColumn key={col.id} col={col} handleCardClick={handleCardClick} />
            ))}
          </div>
        </div>
        {/* modal de detalhe do conteúdo — só renderiza quando há um conteúdo selecionado */}
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
            agencyCommentText={agencyCommentText}
            setAgencyCommentText={setAgencyCommentText}
            agencyCommentLoading={agencyCommentLoading}
            handleAgencyCommentSubmit={handleAgencyCommentSubmit}
          />
        )}
        {/* modal de criação de conteúdo — só renderiza quando está aberto */}
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

  // vista padrão com a lista de clientes quando nenhum está selecionado
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
          {/* grelha de cards de clientes filtrada por pesquisa e estado */}
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
      {/* drawers de edição e criação — só renderizam quando estão ativos */}
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
