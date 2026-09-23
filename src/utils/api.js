// src/utils/api.js
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiRequest = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    throw new Error(err.message || 'Something went wrong');
  }
};

// Users
export const getUsers = () => apiRequest('/users');

// Products (jsonplaceholder has no /products — we use /posts as product feed)
export const getProducts = () => apiRequest('/posts');

// Todos / Tasks
export const getTodos = () => apiRequest('/todos');

// Comments (used for notifications feed)
export const getComments = () => apiRequest('/comments');

// Albums / Photos
export const getAlbums = () => apiRequest('/albums');
export const getPhotos = () => apiRequest('/photos');