const BASE_URL = "http://localhost:5000/api";

// clientes
export const getClients = async () => {
  const res = await fetch(`${BASE_URL}/clients`);
  return await res.json();
};

export const getClientById = async (id) => {
  const res = await fetch(`${BASE_URL}/clients/${id}`);
  return await res.json();
};

export const createClient = async (data) => {
  const res = await fetch(`${BASE_URL}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const updateClient = async (id, data) => {
  const res = await fetch(`${BASE_URL}/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const deleteClient = async (id) => {
  const res = await fetch(`${BASE_URL}/clients/${id}`, {
    method: "DELETE",
  });
  return await res.json();
};

// cards
export const getCards = async () => {
  const res = await fetch(`${BASE_URL}/cards`);
  return await res.json();
};

export const getCardsByClient = async (client_id) => {
  const res = await fetch(`${BASE_URL}/cards/by-client?client_id=${client_id}`);
  return await res.json();
};

export const getCardById = async (id) => {
  const res = await fetch(`${BASE_URL}/cards/${id}`);
  return await res.json();
};

export const createCard = async (data) => {
  const res = await fetch(`${BASE_URL}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const updateCard = async (id, data) => {
  const res = await fetch(`${BASE_URL}/cards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const updateCardStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/cards/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return await res.json();
};

export const deleteCard = async (id) => {
  const res = await fetch(`${BASE_URL}/cards/${id}`, {
    method: "DELETE",
  });
  return await res.json();
};

// comentários
export const getCommentsByCard = async (card_id) => {
  const res = await fetch(`${BASE_URL}/comments?card_id=${card_id}`);
  return await res.json();
};

export const deleteComment = async (id) => {
  const res = await fetch(`${BASE_URL}/comments/${id}`, { method: 'DELETE' });
  return await res.json();
};

export const createComment = async (data) => {
  const res = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

// métricas
export const getMetricsByCard = async (card_id) => {
  const res = await fetch(`${BASE_URL}/metrics?card_id=${card_id}`);
  return await res.json();
};

export const createMetrics = async (data) => {
  const res = await fetch(`${BASE_URL}/metrics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const updateMetrics = async (id, data) => {
  const res = await fetch(`${BASE_URL}/metrics/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};
