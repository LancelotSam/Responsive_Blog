import React from 'react';
import { render, screen } from '@testing-library/react';
import PostEditor from '../components/PostEditor';

// Mocking the react-markdown-editor-lite
jest.mock('react-markdown-editor-lite', () => {
  return ({ children }) => <div>{children}</div>;
});

test('renders PostEditor component', () => {
  render(<PostEditor />);
  const editorElement = screen.getByText(/Create Post/i);
  expect(editorElement).toBeInTheDocument();
});
