import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import styles from './Glossary.module.css';

const PAGE = { initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, exit:{opacity:0}, transition:{duration:0.3} };
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function Glossary() {
  const [terms,   setTerms  ] = useState([]);
  const [filter,  setFilter ] = useState('');
  const [letter,  setLetter ] = useState('');
  const [query,   setQuery  ] = useState('');
  const [result,  setResult ] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState('');
  const [toast,   setToast  ] = useState('');

  useEffect(() => {
    api.get('/glossary').then((r) => setTerms(r.data.terms)).catch(() => {});
  }, []);

  const search = async () => {
    const q = query.trim();
    if (q.length < 2) { setError('Enter at least 2 characters.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await api.get(`/glossary/search?q=${encodeURIComponent(q)}`);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const shown = terms.filter((t) => {
    const matchFilter = !filter || t.term.toLowerCase().includes(filter.toLowerCase());
    const matchLetter = !letter || t.letter === letter;
    return matchFilter && matchLetter;
  });

  const copy = (t) => {
    navigator.clipboard.writeText(`${t.term}: ${t.definition}`);
    setToast('Copied!'); setTimeout(() => setToast(''), 1500);
  };

  return (
    <motion.div {...PAGE} className="page container">
      <header className={styles.header}>
        <p className="section-label">30 Terms · AI-Powered Search</p>
        <h1>Election Glossary</h1>
        <p>Search any election term for a clear, AI-generated definition and real-world example.</p>
      </header>

      {/* AI Search */}
      <section className={styles.searchSection} aria-label="AI term search">
        <div className={styles.searchRow}>
          <input
            className={styles.searchInput}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="Search any election term…"
            aria-label="Search election term"
            maxLength={80}
          />
          <button className="btn btn-primary" onClick={search} disabled={loading} aria-label="Search">
            {loading ? '…' : '🔍 Search'}
          </button>
        </div>
        {error && <p role="alert" style={{ color:'var(--error)', fontSize:'0.85rem', marginTop:'0.4rem' }}>{error}</p>}

        {result && (
          <motion.div
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            className={`card ${styles.resultCard}`}
          >
            <div className={styles.resultHeader}>
              <h2>{result.term}</h2>
              {result.demo && <span className="badge badge-warning">Demo Mode</span>}
            </div>
            <p className={styles.def}>{result.definition}</p>
            {result.example && <p className={styles.example}>📌 <em>{result.example}</em></p>}
            {result.relatedTerms?.length > 0 && (
              <p className={styles.related}>
                Related: {result.relatedTerms.map((r, i) => (
                  <button key={r} className={styles.relBtn}
                    onClick={() => { setQuery(r); setResult(null); setTimeout(search, 0); }}
                  >{r}{i < result.relatedTerms.length-1 ? ', ' : ''}</button>
                ))}
              </p>
            )}
          </motion.div>
        )}
      </section>

      <hr className="divider" />

      {/* Filter */}
      <section aria-label="Filter glossary">
        <div className={styles.filterRow}>
          <input
            className={styles.filterInput}
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setLetter(''); }}
            placeholder="Filter terms…"
            aria-label="Filter terms by text"
          />
          <div className={styles.alphabet} role="group" aria-label="Filter by letter">
            {LETTERS.map((l) => (
              <button
                key={l}
                className={`${styles.letterBtn} ${letter === l ? styles.active : ''}`}
                onClick={() => { setLetter(letter === l ? '' : l); setFilter(''); }}
                aria-pressed={letter === l}
                aria-label={`Filter by letter ${l}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Term cards */}
      <ul className={styles.grid} role="list">
        {shown.map((t) => (
          <motion.li key={t.term} layout initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <article className={`card ${styles.termCard}`}>
              <div className={styles.termHeader}>
                <h2>{t.term}</h2>
                <button className={styles.copyBtn} onClick={() => copy(t)} aria-label={`Copy definition of ${t.term}`}>⧉</button>
              </div>
              <p className={styles.termDef}>{t.definition}</p>
              <p className={styles.termEx}>📌 {t.example}</p>
              {t.relatedTerms?.length > 0 && (
                <p className={styles.relatedSmall}>
                  See also: {t.relatedTerms.join(' · ')}
                </p>
              )}
            </article>
          </motion.li>
        ))}
        {shown.length === 0 && (
          <li><p style={{ color:'var(--text-muted)' }}>No terms match your filter.</p></li>
        )}
      </ul>

      {toast && <div className="toast" role="status">{toast}</div>}
    </motion.div>
  );
}
