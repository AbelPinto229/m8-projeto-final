const BASE_URL = "http://localhost:5000/api";

// clientes
export const getClients = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/clients`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const getClientById = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/clients/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const createClient = async (body) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const getMyClients = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/clients/mine`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const createClientUser = async (email, password, client_id, name) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/auth/create-client-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ email, password, client_id, name }),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const updateClient = async (id, body) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/clients/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const deleteClient = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/clients/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
  return data;
};

// cards
export const getCardsByClient = async (client_id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/cards/by-client?client_id=${client_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const createCard = async (body) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const updateCard = async (id, body) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/cards/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const updateCardStatus = async (id, status) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/cards/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const deleteCard = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/cards/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
  return data;
};

// comentários
export const getCommentsByCard = async (card_id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/comments?card_id=${card_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const createComment = async (body) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const deleteComment = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
  return data;
};

// métricas
export const getMetricsByCard = async (card_id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/metrics?card_id=${card_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const createMetrics = async (body) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/metrics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const updateMetrics = async (id, body) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/metrics/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

// notificações
export const getNotificationsForAgency = async (client_id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/notifications/agency?client_id=${client_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const getNotificationsForClient = async (client_id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/notifications/client?client_id=${client_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const markNotificationsRead = async (client_id, for_agency) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/notifications/read-all`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ client_id, for_agency }),
  });
  const data = await response.json();
  console.log(data);
};

export const markNotificationRead = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
};

export const checkEmail = async (email) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/auth/check-email?email=${encodeURIComponent(email)}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  return response.json();
};

// contacto (rota pública)
export const submitContact = async (body) => {
  const response = await fetch(`${BASE_URL}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  return data;
};
