import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the TuniSec demo access screen', () => {
  render(<App />);
  const title = screen.getByRole('heading', { name: /TuniSec/i });
  expect(title).toBeInTheDocument();
  const button = screen.getByRole('button', { name: /Entrer dans la démo/i });
  expect(button).toBeInTheDocument();
});
