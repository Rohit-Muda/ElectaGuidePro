import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Learn from '../Learn';
import { AppProvider } from '../../context/AppContext';
import api from '../../api/axios';
import { vi } from 'vitest';

vi.mock('../../api/axios', () => {
  return {
    default: {
      get: vi.fn()
    }
  };
});

describe('Learn Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and displays modules', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        modules: [
          { id: 1, title: 'Test Module', icon: '🌟', description: 'Test desc', readTime: '5 min', difficulty: 'Beginner' }
        ]
      }
    });

    render(
      <MemoryRouter>
        <AppProvider>
          <Learn />
        </AppProvider>
      </MemoryRouter>
    );

    // Initial state
    expect(screen.getByLabelText('Loading modules')).toBeInTheDocument();

    // Wait for modules to load
    await waitFor(() => {
      expect(screen.getByText('Test Module')).toBeInTheDocument();
      expect(screen.getByText('Test desc')).toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    api.get.mockRejectedValueOnce(new Error('Failed to load'));

    render(
      <MemoryRouter>
        <AppProvider>
          <Learn />
        </AppProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
    });
  });
});
