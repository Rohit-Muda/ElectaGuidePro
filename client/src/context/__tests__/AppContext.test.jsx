import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider, useApp } from '../AppContext';
import { act } from 'react';

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

// A test component to consume and mutate the context
function TestComponent() {
  const { 
    progress, markComplete, 
    incrementChat,
    saveQuizScore
  } = useApp();

  return (
    <div>
      <span data-testid="completed-modules">{Object.keys(progress.completed).join(',')}</span>
      <span data-testid="chat-count">{progress.chatCount}</span>
      <span data-testid="quiz-score">{progress.quizScores[1] || 0}</span>
      
      <button onClick={() => markComplete(1)}>Complete 1</button>
      <button onClick={incrementChat}>Add Chat</button>
      <button onClick={() => saveQuizScore(1, 4)}>Score 4 on 1</button>
    </div>
  );
}

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default state and allows updates', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // Initial state
    expect(screen.getByTestId('completed-modules')).toHaveTextContent('');
    expect(screen.getByTestId('chat-count')).toHaveTextContent('0');
    expect(screen.getByTestId('quiz-score')).toHaveTextContent('0');

    // Mutate state
    fireEvent.click(screen.getByText('Complete 1'));
    fireEvent.click(screen.getByText('Add Chat'));
    fireEvent.click(screen.getByText('Score 4 on 1'));

    // Check updated state
    expect(screen.getByTestId('completed-modules')).toHaveTextContent('1');
    expect(screen.getByTestId('chat-count')).toHaveTextContent('1');
    expect(screen.getByTestId('quiz-score')).toHaveTextContent('4');
  });

  it('loads state from localStorage', () => {
    localStorage.setItem('eg_progress', JSON.stringify({
      completed: { 2: true, 3: true },
      chatCount: 5,
      quizScores: { 1: 5 }
    }));

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('completed-modules')).toHaveTextContent('2,3');
    expect(screen.getByTestId('chat-count')).toHaveTextContent('5');
    expect(screen.getByTestId('quiz-score')).toHaveTextContent('5');
  });
});
