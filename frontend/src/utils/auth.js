// frontend/src/utils/auth.js
import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token ? jwtDecode(token).exp > Date.now() / 1000 : false;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return jwtDecode(token);
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem('token');
};