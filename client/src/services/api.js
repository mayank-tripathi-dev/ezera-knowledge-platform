const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('ezera_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  demoLogin: async (role) => {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Demo login failed');
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  },

  // Cards
  getCards: async () => {
    const res = await fetch(`${API_BASE}/cards`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch cards');
    return await res.json();
  },

  createCard: async (cardData) => {
    const res = await fetch(`${API_BASE}/cards`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cardData)
    });
    if (!res.ok) throw new Error('Failed to create card');
    return await res.json();
  },

  updateCard: async (nodeId, cardData) => {
    const res = await fetch(`${API_BASE}/cards/${nodeId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(cardData)
    });
    if (!res.ok) throw new Error('Failed to update card');
    return await res.json();
  },

  updateCardPosition: async (nodeId, position) => {
    const res = await fetch(`${API_BASE}/cards/${nodeId}/position`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ position })
    });
    return await res.json();
  },

  deleteCard: async (nodeId) => {
    const res = await fetch(`${API_BASE}/cards/${nodeId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await res.json();
  },

  autoArrange: async () => {
    const res = await fetch(`${API_BASE}/cards/auto-arrange`, {
      method: 'POST',
      headers: getHeaders()
    });
    return await res.json();
  },

  resetGrid: async () => {
    const res = await fetch(`${API_BASE}/cards/reset`, {
      method: 'POST',
      headers: getHeaders()
    });
    return await res.json();
  },

  // Connections
  getConnections: async () => {
    const res = await fetch(`${API_BASE}/connections`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch connections');
    return await res.json();
  },

  createConnection: async (connData) => {
    const res = await fetch(`${API_BASE}/connections`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(connData)
    });
    return await res.json();
  },

  deleteConnection: async (connectionId) => {
    const res = await fetch(`${API_BASE}/connections/${connectionId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await res.json();
  },

  // Board
  getBoard: async () => {
    const res = await fetch(`${API_BASE}/boards`, { headers: getHeaders() });
    return await res.json();
  },

  updateBoard: async (boardData) => {
    const res = await fetch(`${API_BASE}/boards`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(boardData)
    });
    return await res.json();
  }
};
