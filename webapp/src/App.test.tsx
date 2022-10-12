import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Select Replay File Text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Select Replay File/i);
  expect(linkElement).toBeDefined();
});
