// server/todos.js

const BASE_URL = 'http://localhost:3000';

const useFetch = async (url, options) => {
  const response = await fetch(url, options);
  return response;
};

const handleResponse = async (response) => {
  console.log('Response status:', response.status);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const jsonData = await response.json();
    return jsonData;
  } else {
    console.warn('Response is not JSON:', response);
    return response.text();
  }
};

const api = {
  async get(endpoint) {
    const response = await useFetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
    });
    return handleResponse(response);
  },
  async post(endpoint, data) {
    const response = await useFetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  async patch(endpoint, data) {
    const response = await useFetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  async delete(endpoint) {
    const response = await useFetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

export default api;
