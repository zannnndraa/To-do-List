// server/todos.js

const BASE_URL = 'http://localhost:3000';

const useFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, URL: ${url}`);
    }

    return response;
  } catch (error) {
    console.error('Error in useFetch:', error);
    throw error;
  }
};

const handleResponse = async (response) => {
  console.log('Response status:', response.status);

  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const jsonData = await response.json();
      return jsonData;
    } else {
      console.warn('Response is not JSON:', response);
      return response.text();
    }
  } catch (error) {
    console.error('Error handling response:', error);
    throw error;
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
    const taskWithDate = {
      ...data,
      date: new Date().toISOString(), 
    };
  
    const response = await useFetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(taskWithDate),
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
