import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

test('renders the TuniSec demo access screen', () => {
  render(<App />);
  const title = screen.getByRole('heading', { name: /TuniSec/i });
  expect(title).toBeInTheDocument();
  const button = screen.getByRole('button', { name: /Entrer dans la démo/i });
  expect(button).toBeInTheDocument();
});

test('switches the interface language and enables RTL for Arabic', async () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Langue'), { target: { value: 'en' } });

  expect(await screen.findByRole('button', { name: 'Enter the demo' })).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('Language'), { target: { value: 'ar' } });
  expect(await screen.findByRole('button', { name: 'الدخول إلى النسخة التجريبية' })).toBeInTheDocument();
  await waitFor(() => expect(document.documentElement.dir).toBe('rtl'));
});
