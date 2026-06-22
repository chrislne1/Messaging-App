import { render, screen } from '@testing-library/react';
import App from './App';

test('renders messaging interface header', () => {
  render(<App />);
  expect(screen.getByText(/Messaging/i)).toBeInTheDocument();
  expect(screen.getByText(/Write a message/i)).toBeInTheDocument();
});
