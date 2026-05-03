import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useApp } from '../context/AppContext';
import styles from './MythBuster.module.css';

const PAGE = { initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, exit:{opacity:0}, transition:{duration:0.3} };

const STATIC_MYTHS = [
  { myth:'Voter fraud is widespread and changes election results.', fact:'Verified fraud rates are consistently below 0.0001% of votes cast — too rare to affect outcomes.', source:'Brennan Center for Justice, MIT Election Lab' },
  { myth:'My single vote doesn\'t matter — one vote never changes anything.', fact:'The 2000 US Presidential Election in Florida was decided by 537 votes. Many local elections are decided by single digits.', source:'FairVote.org' },
  { myth:'Official results are always announced on election night.', fact:'Election night projections are media estimates. Official certified results take days to weeks of careful counting.', source:'National Conference of State Legislatures' },
  { myth:'Non-citizens regularly vote in elections.', fact:'Non-citizens are legally barred from voting in national elections. Registering while ineligible is a criminal offence.', source:'U.S. Election Assistance Commission' },
  { myth:'Dead people regularly vote in elections.', fact:'Electoral rolls are regularly audited. Errors exist, but no verified evidence of organised large-scale dead-voter fraud.', source:'MIT Election Lab' },
  { myth:'Electronic voting machines can easily be hacked to change results.', fact:'Most use air-gapped systems (no internet), paper backups, and multi-layer verification. No confirmed case of outcome-changing machine hack.', source:'Cybersecurity & Infrastructure Security Agency (CISA)' },
];

export default function MythBuster() {
  const { incrementMyth } = useApp();
  const [seen,    setSeen    ] = useState([]);
  const [card,    setCard    ] = useState(null);
  const [flipped, setFlipped ] = useState(false);
  const [loading, setLoading ] = useState(false);
  const [toast,   setToast   ] = useState('');
  const [count,   setCount   ] = useState(0);

  useEffect(() => { incrementMyth(); }, []);

  const getMyth = async () => {
    setFlipped(false);
    setLoading(true);

    /* Try API first (Gemini), fall back to static pool */
    try {
      const { data } = await api.get('/myths/random');
      if (data?.myth) {
        setCard(data);
        setSeen((s) => [...s, data.myth]);
        setCount((c) => c + 1);
        setLoading(false);
        return;
      }
    } catch (_) { /* fall through */ }

    /* Static fallback */
    const available = STATIC_MYTHS.filter((m) => !seen.includes(m.myth));
    const pool = available.length > 0 ? available : STATIC_MYTHS;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setCard(pick);
    setSeen((s) => [...s, pick.myth]);
    setCount((c) => c + 1);
    setLoading(false);
  };

  const reveal = () => setFlipped(true);

  const share = () => {
    if (!card) return;
    const text = `❌ MYTH: ${card.myth}\n✅ FACT: ${card.fact}\n\nSource: ${card.source || 'ElectaGuide Pro'}`;
    navigator.clipboard.writeText(text);
    setToast('Copied to clipboard!');
    setTimeout(() => setToast(''), 1800);
  };

  return (
    <motion.div {...PAGE} className="page container">
      <header className={styles.header}>
        <p className="section-label">Election Misinformation · Fact-Checked</p>
        <h1>⚡ Myth Buster</h1>
        <p>Discover common election myths and the facts that debunk them.</p>
        {count > 0 && (
          <p className={styles.counter} role="status" aria-live="polite">
            You've busted <strong>{count}</strong> myth{count !== 1 ? 's' : ''}!
          </p>
        )}
      </header>

      <div className={styles.centre}>
        <button
          className="btn btn-primary"
          onClick={getMyth}
          disabled={loading}
          aria-label="Reveal a new election myth"
          style={{ fontSize:'1.05rem', padding:'0.8rem 2rem' }}
        >
          {loading ? 'Loading…' : '⚡ Reveal a New Myth'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {card && (
          <motion.div
            key={card.myth}
            initial={{ opacity:0, y:30 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-20 }}
            className={styles.flipWrap}
          >
            <div className={`${styles.flipCard} ${flipped ? styles.isFlipped : ''}`} aria-live="polite">
              {/* Front — myth */}
              <div className={`card ${styles.face} ${styles.front}`} aria-hidden={flipped}>
                <p className={styles.faceLabel}>❌ Common Myth</p>
                <blockquote className={styles.mythText}>"{card.myth}"</blockquote>
                {!flipped && (
                  <button className="btn btn-primary" onClick={reveal} style={{ marginTop:'1.5rem' }}
                    aria-label="Reveal the truth">
                    Reveal the Truth →
                  </button>
                )}
              </div>

              {/* Back — fact */}
              <div className={`card ${styles.face} ${styles.back}`} aria-hidden={!flipped}>
                <p className={styles.faceLabel}>✅ The Real Fact</p>
                <p className={styles.factText}>{card.fact}</p>
                {card.source && (
                  <p className={styles.source}>📎 Source: <em>{card.source}</em></p>
                )}
                <div className={styles.backActions}>
                  <button className="btn btn-outline" onClick={share} aria-label="Copy myth and fact to clipboard">
                    📋 Share Fact
                  </button>
                  <button className="btn btn-primary" onClick={getMyth} aria-label="Get another myth">
                    Next Myth →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!card && !loading && (
        <p className={styles.empty}>Press the button above to reveal your first myth!</p>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </motion.div>
  );
}
