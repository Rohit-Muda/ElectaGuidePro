import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useApp } from '../context/AppContext';
import styles from './Learn.module.css';

const PAGE = { initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, exit:{opacity:0}, transition:{duration:0.3} };

const DIFF_COLOR = { Beginner:'var(--success)', Intermediate:'var(--warning)', Advanced:'var(--error)' };

export default function Learn() {
  const { progress } = useApp();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState(null);

  useEffect(() => {
    api.get('/modules')
      .then((r) => setModules(r.data.modules))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const done = Object.keys(progress.completed || {}).length;

  return (
    <motion.div {...PAGE}>
      <div className="page container">
        <header className={styles.header}>
          <p className="section-label">8 Modules · AI-Powered Content</p>
          <h1>Election Learning Modules</h1>
          <p>Master every aspect of the election process — from basics to ballot counting.</p>
          {done > 0 && (
            <p className={styles.progress}>
              ✅ {done} of 8 modules completed ·{' '}
              <Link to="/progress">View progress →</Link>
            </p>
          )}
        </header>

        {loading && (
          <div className={styles.grid} aria-busy="true" aria-label="Loading modules">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`card ${styles.skeleton}`} style={{ height:200 }} />
            ))}
          </div>
        )}

        {error && (
          <p role="alert" style={{ color:'var(--error)', textAlign:'center', padding:'2rem' }}>
            ⚠️ {error}
          </p>
        )}

        {!loading && !error && (
          <ul className={styles.grid} role="list">
            {modules.map((mod, i) => {
              const completed = !!progress.completed?.[mod.id];
              const score     = progress.quizScores?.[mod.id];
              return (
                <motion.li
                  key={mod.id}
                  initial={{ opacity:0, y:20 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={`/learn/${mod.id}`}
                    className={`card ${styles.card} ${completed ? styles.done : ''}`}
                    aria-label={`${mod.title} — ${mod.difficulty}, ${mod.readTime}${completed ? ', completed' : ''}`}
                  >
                    <div className={styles.cardTop}>
                      <span className={styles.icon} aria-hidden="true">{mod.icon}</span>
                      {completed && <span className={styles.badge} aria-hidden="true">✅</span>}
                    </div>
                    <h2 className={styles.title}>{mod.title}</h2>
                    <p className={styles.desc}>{mod.description}</p>
                    <footer className={styles.meta}>
                      <span style={{ color: DIFF_COLOR[mod.difficulty] }}>● {mod.difficulty}</span>
                      <span>⏱ {mod.readTime}</span>
                      {score !== undefined && <span>🎯 {score}/5</span>}
                    </footer>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
