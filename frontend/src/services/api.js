const BASE_URL = 'http://localhost:5000/api';

// CLIENTS
export const getClients = () =>
  fetch(`${BASE_URL}/clients`).then(r => r.json());

export const getClientById = (id) =>
  fetch(`${BASE_URL}/clients/${id}`).then(r => r.json());

export const createClient = (data) =>
  fetch(`${BASE_URL}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateClient = (id, data) =>
  fetch(`${BASE_URL}/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteClient = (id) =>
  fetch(`${BASE_URL}/clients/${id}`, { method: 'DELETE' }).then(r => r.json());


// CARDS
export const getCards = () =>
  fetch(`${BASE_URL}/cards`).then(r => r.json());

export const getCardsByClient = (client_id) =>
  fetch(`${BASE_URL}/cards?client_id=${client_id}`).then(r => r.json());

export const getCardById = (id) =>
  fetch(`${BASE_URL}/cards/${id}`).then(r => r.json());

export const createCard = (data) =>
  fetch(`${BASE_URL}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateCard = (id, data) =>
  fetch(`${BASE_URL}/cards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateCardStatus = (id, status) =>
  fetch(`${BASE_URL}/cards/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then(r => r.json());

export const deleteCard = (id) =>
  fetch(`${BASE_URL}/cards/${id}`, { method: 'DELETE' }).then(r => r.json());


// COMMENTS
export const getCommentsByCard = (card_id) =>
  fetch(`${BASE_URL}/comments?card_id=${card_id}`).then(r => r.json());

export const createComment = (data) =>
  fetch(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());


// METRICS
export const getMetricsByCard = (card_id) =>
  fetch(`${BASE_URL}/metrics?card_id=${card_id}`).then(r => r.json());

export const createMetrics = (data) =>
  fetch(`${BASE_URL}/metrics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateMetrics = (id, data) =>
  fetch(`${BASE_URL}/metrics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());
