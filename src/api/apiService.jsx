
export const API_BASE_URL = import.meta.env.VITE_API_URL;

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

// For FormData uploads (image), we let the browser set the boundary and Content-Type
const getAuthHeadersForUpload = () => {
  const token = localStorage.getItem('authToken');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    // Clear ALL auth-related localStorage keys (including isLoggedIn!)
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('isLoggedIn'); // <-- this was missing before!

    // Notify the Redux store via a custom event (handled in main.jsx/store listener)
    window.dispatchEvent(new Event('auth:logout'));

    // Only redirect if not already on sign-in page
    if (!window.location.pathname.includes('/sign-in')) {
      window.location.href = '/sign-in';
    }
    throw new Error('Invalid or expired token');
  }

  let data;
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }
  } catch (parseError) {
    console.error('Error parsing response:', parseError);
    throw new Error('Invalid response format from server');
  }

  if (!response.ok) {
    const errorMessage = data.message || data.error || data.msg || 'An error occurred';
    throw new Error(errorMessage);
  }

  return data;
};

export const apiService = {

  // Product endpoints
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await handleResponse(response);
    // Normalize data: map product_id to id if id is missing
    if (Array.isArray(data)) {
      return data.map(product => ({
        ...product,
        id: product.id || product.product_id
      }));
    }
    return data;
  },

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
    const response = await fetch(`${API_BASE_URL}/addCart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity, price }),
    });
    return handleResponse(response);
  },

  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/getCart`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateCart: async (productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/updateCart/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(response);
  },

  removeFromCart: async (cartItemId) => {
    const response = await fetch(`${API_BASE_URL}/removeCart/${cartItemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  clearCart: async () => {
    const response = await fetch(`${API_BASE_URL}/clearCart`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Order endpoints
  placeOrder: async (address, paymentMethod) => {
    const response = await fetch(`${API_BASE_URL}/placeOrder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ address, paymentMethod }),
    });
    return handleResponse(response);
  },

  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/getOrders`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  cancelOrder: async (orderId) => {
    console.log("Sending cancel request for orderId:", orderId);

    // Backend route: router.delete('/cancelorder/:orderId', ...)
    const response = await fetch(`${API_BASE_URL}/cancelorder/${orderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Address endpoints
  addAddress: async (addressData) => {
    const response = await fetch(`${API_BASE_URL}/add-address`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData),
    });
    return handleResponse(response);
  },

  getAddresses: async () => {
    const response = await fetch(`${API_BASE_URL}/get-addresses`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  deleteAddress: async (addressId) => {
    const response = await fetch(`${API_BASE_URL}/delete-address/${addressId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    // Check if profileData is FormData (for image upload)
    const isFormData = profileData instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/update-profile`, {
      method: 'PUT',
      headers: isFormData ? getAuthHeadersForUpload() : getAuthHeaders(),
      body: isFormData ? profileData : JSON.stringify(profileData),
    });
    return handleResponse(response);
  },
};

export default apiService;
