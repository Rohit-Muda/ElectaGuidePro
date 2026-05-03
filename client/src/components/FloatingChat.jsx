import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FloatingChat.module.css';

export default function FloatingChat() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const go = () => navigate('/chat');

  return (
    <div className={styles.wrap}>
      {visible && (
        <div className={styles.bubble} role="dialog" aria-label="Quick chat preview">
          <p>👋 <strong>Ask ElectaGuide</strong></p>
          <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', margin:'0.4rem 0 0.8rem' }}>
            Have a question about elections?
          </p>
          <button className="btn btn-primary" onClick={go} style={{ width:'100%' }}>
            Open Chat
          </button>
        </div>
      )}
      <button
        className={styles.fab}
        onClick={() => setVisible((v) => !v)}
        aria-label="Open AI chat assistant"
        aria-expanded={visible}
      >
        {visible ? '✕' : '💬'}
      </button>
    </div>
  );
}
