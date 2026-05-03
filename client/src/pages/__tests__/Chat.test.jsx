import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Chat from '../Chat';
import { AppProvider } from '../../context/AppContext';
import api from '../../api/axios';
import { vi } from 'vitest';

vi.mock('../../api/axios', () => {
  return {
    default: {
      post: vi.fn()
    }
  };
});

describe('Chat Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders chat interface and sends a message', async () => {
    api.post.mockResolvedValueOnce({ data: { reply: 'AI Response' } });

    render(
      <MemoryRouter>
        <AppProvider>
          <Chat />
        </AppProvider>
      </MemoryRouter>
    );

    // Initial state shows starters
    expect(screen.getByText('Ask anything about elections')).toBeInTheDocument();

    // Type a message
    const input = screen.getByPlaceholderText(/Ask about/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    // Submit
    const form = screen.getByLabelText('Chat input');
    fireEvent.submit(form);

    // Should show user message immediately
    expect(screen.getByText('Hello')).toBeInTheDocument();

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('AI Response')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    api.post.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <AppProvider>
          <Chat />
        </AppProvider>
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Ask about/i);
    fireEvent.change(input, { target: { value: 'Fail me' } });
    fireEvent.submit(screen.getByLabelText('Chat input'));

    await waitFor(() => {
      expect(screen.getByText('⚠️ Network error')).toBeInTheDocument();
    });
  });
});
