const BASE_URL = 'http://localhost:3001';


const api = {
  async get(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    return handleResponse(response);
  },

  async post(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
    });
    return handleResponse(response);
  },

  async patch(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async delete(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

export default api; 
