// frontend/src/services/postService.js
import axios from 'axios';

const API_URL = '/api/posts';

export const fetchPosts = async (page, limit) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
