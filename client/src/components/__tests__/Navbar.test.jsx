import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import { AppProvider } from '../../context/AppContext';

const localStorageMock = (function() {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key) {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Navbar Component', () => {
  it('renders logo and navigation links', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <Navbar />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('ElectaGuide')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('AI Chat')).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <Navbar />
        </AppProvider>
      </MemoryRouter>
    );
    
    const toggleButton = screen.getByLabelText(/Open menu/i);
    fireEvent.click(toggleButton);
    
    // The aria-expanded should change
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click again to close
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });
});
