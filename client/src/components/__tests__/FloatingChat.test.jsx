import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import FloatingChat from '../FloatingChat';
import { vi } from 'vitest';

// Mock react-router-dom to intercept navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: () => ({ pathname: '/' })
  };
});

describe('FloatingChat Component', () => {
  it('renders the chat button', () => {
    render(
      <MemoryRouter>
        <FloatingChat />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Open AI chat assistant/i })).toBeInTheDocument();
  });

  it('navigates to chat page when clicked and closes menu', () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <FloatingChat />
      </MemoryRouter>
    );
    
    const button = screen.getByRole('button', { name: /Open AI chat assistant/i });
    fireEvent.click(button);
    
    // The menu should open
    expect(screen.getByText('Have a question about elections?')).toBeInTheDocument();
    
    // Click a starter
    const starter = screen.getByRole('button', { name: 'Open Chat' });
    fireEvent.click(starter);
    
    expect(mockNavigate).toHaveBeenCalledWith('/chat');
  });
});
