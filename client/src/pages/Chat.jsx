import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useApp } from '../context/AppContext';
import styles from './Chat.module.css';

const PAGE = { initial:{opacity:0}, animate:{opacity:1}, exit:{opacity:0}, transition:{duration:0.2} };

const STARTERS = [
  'How do I register to vote?',
  'How are votes counted?',
  'What is the Electoral College?',
  'What happens if results are disputed?',
  'What is gerrymandering?',
];

function TypingDots() {
  return (
    <div className={styles.typing} aria-label="ElectaGuide is typing">
      {[0,1,2].map((i) => (
        <span key={i} className={styles.dot} style={{ animationDelay:`${i*0.18}s` }} />
      ))}
    </div>
  );
}

function Msg({ msg }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const isUser = msg.role === 'user';
  return (
    <motion.div
      className={`${styles.msg} ${isUser ? styles.user : styles.bot}`}
      initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
    >
      {!isUser && <span className={styles.avatar} aria-hidden="true">🗳️</span>}
      <div className={styles.bubble}>
        <p className={styles.text} style={{ whiteSpace:'pre-wrap' }}>{msg.content}</p>
        <div className={styles.meta}>
          <time className={styles.time} dateTime={msg.time}>
            {new Date(msg.time).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
          </time>
          {!isUser && (
            <button
              className={styles.copy} onClick={copy}
              aria-label={copied ? 'Copied!' : 'Copy message'}
            >
              {copied ? '✓' : '⧉'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const MAX_MSGS = 20;

export default function Chat() {
  const location = useLocation();
  const { incrementChat } = useApp();
  const [history,  setHistory ] = useState([]);
  const [input,    setInput   ] = useState(location.state?.context || '');
  const [loading,  setLoading ] = useState(false);
  const [error,    setError   ] = useState('');
  const [count,    setCount   ] = useState(0);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [history, loading]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  /* Auto-resize textarea height as user types */
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
  }, [input]);

  const send = async (text = input.trim()) => {
    if (!text || loading || count >= MAX_MSGS) return;
    const userMsg = { role:'user', content:text, time: new Date().toISOString() };
    setHistory((h) => [...h, userMsg]);
    setInput('');
    setLoading(true);
    setError('');
    setCount((c) => c + 1);
    incrementChat();

    try {
      const { data } = await api.post('/chat', {
        message: text,
        history: history.slice(-10),
      });
      const botMsg = { role:'assistant', content: data.reply, time: new Date().toISOString() };
      setHistory((h) => [...h, botMsg]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => { setHistory([]); setCount(0); setError(''); };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <motion.div {...PAGE} className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>🗳️ ElectaGuide AI Chat</h1>
          <p className={styles.sub}>Neutral · Non-partisan · Powered by Google Gemini</p>
        </div>
        <div className={styles.headerRight}>
          <span className={`badge ${count >= MAX_MSGS ? 'badge-warning' : 'badge-info'}`}>
            {count}/{MAX_MSGS} messages
          </span>
          {history.length > 0 && (
            <button className="btn btn-ghost" onClick={clear} aria-label="Clear chat history" style={{ fontSize:'0.82rem', padding:'0.4rem 0.8rem' }}>
              Clear Chat
            </button>
          )}
        </div>
      </header>

      {/* Messages */}
      <section className={styles.messages} aria-label="Chat messages" aria-live="polite">
        {history.length === 0 && !loading && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Ask anything about elections</p>
            <p className={styles.emptySub}>Try one of these questions:</p>
            <ul className={styles.starters} role="list">
              {STARTERS.map((s) => (
                <li key={s}>
                  <button className={styles.starter} onClick={() => send(s)}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <AnimatePresence initial={false}>
          {history.map((msg, i) => <Msg key={`${msg.time}-${i}`} msg={msg} />)}
        </AnimatePresence>

        {loading && (
          <div className={`${styles.msg} ${styles.bot}`}>
            <span className={styles.avatar} aria-hidden="true">🗳️</span>
            <TypingDots />
          </div>
        )}

        {error && (
          <p role="alert" className={styles.error}>⚠️ {error}</p>
        )}

        {count >= MAX_MSGS && (
          <p className={styles.limit} role="status">
            Message limit reached. <button className="btn btn-ghost" onClick={clear} style={{ fontSize:'inherit', padding:'0.2rem 0.6rem' }}>Start a new chat</button>
          </p>
        )}
        <div ref={bottomRef} />
      </section>

      {/* Input */}
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); send(); }} aria-label="Chat input">
        <textarea
          ref={inputRef}
          className={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Ask about voter registration, how votes are counted…"
          rows={1}
          maxLength={500}
          aria-label="Your message"
          disabled={count >= MAX_MSGS}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!input.trim() || loading || count >= MAX_MSGS}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </motion.div>
  );
}
