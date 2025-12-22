const API_BASE_URL = 'https://my-store-backend-h6ho.onrender.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('cart');
    window.location.href = '/sign-in';
    throw new Error('Invalid or expired token');
  }
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || 'An error occurred');
  }
  
  return data;
};

export const apiService = {
  
  // Auth endpoints
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // Cart endpoints
  addToCart: async (productId, quantity, price) => {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity, price }),
    });
    return handleResponse(response);
  },

  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  removeFromCart: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  clearCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Order endpoints
  placeOrder: async (address, paymentMethod) => {
    const response = await fetch(`${API_BASE_URL}/orders/place`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ address, paymentMethod }),
    });
    return handleResponse(response);
  },

  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

export default apiService;
