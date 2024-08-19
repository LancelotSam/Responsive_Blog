// frontend/src/__tests__/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

test('renders Home page by default', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
});

test('renders Login page on /login route', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

test('renders Register page on /register route', () => {
  render(
    <MemoryRouter initialEntries={['/register']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Register/i)).toBeInTheDocument();
});

test('renders Dashboard page on /dashboard route when authenticated', () => {
  // Mock the authentication check
  jest.mock('../utils/auth', () => ({
    isAuthenticated: () => true,
  }));

  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
});
