import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProgressRing from '../components/ProgressRing';
import styles from './Progress.module.css';

const PAGE = { initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, exit:{opacity:0}, transition:{duration:0.3} };

const MODULES = [
  { id:1, icon:'🗳️', title:'Election Basics' },
  { id:2, icon:'📋', title:'Voter Registration' },
  { id:3, icon:'🏛️', title:'Candidates & Parties' },
  { id:4, icon:'✅', title:'The Voting Process' },
  { id:5, icon:'🔢', title:'How Votes Are Counted' },
  { id:6, icon:'📊', title:'Results & Transition' },
  { id:7, icon:'📅', title:'Election Timeline' },
  { id:8, icon:'💡', title:'Myths vs Facts' },
];

const ACHIEVEMENTS = [
  { id:'first_module', icon:'🏅', title:'First Step', desc:'Completed your first module' },
  { id:'perfect_score', icon:'🎯', title:'Perfect Score', desc:'Got 5/5 on a quiz' },
  { id:'all_modules', icon:'🔥', title:'Election Expert', desc:'Completed all 8 modules' },
  { id:'myth_buster', icon:'⚡', title:'Myth Buster', desc:'Visited the Myth Buster page' },
];

export default function Progress() {
  const { progress } = useApp();
  const completedCount = Object.keys(progress.completed || {}).length;
  const earned = new Set(progress.achievements || []);

  return (
    <motion.div {...PAGE} className="page container">
      <header className={styles.header}>
        <p className="section-label">Your Learning Journey</p>
        <h1>Progress Dashboard</h1>
      </header>

      {/* Overview ring */}
      <div className={styles.overview}>
        <ProgressRing value={completedCount} max={8} size={160} label={`${completedCount}/8 modules`} />
        <div className={styles.overviewText}>
          <h2>{completedCount === 0 ? 'Ready to Start?' : completedCount === 8 ? '🎉 All Done!' : 'Keep Going!'}</h2>
          <p>{completedCount === 0
            ? 'Complete your first module to track progress here.'
            : `You've completed ${completedCount} of 8 modules.${completedCount < 8 ? ` ${8 - completedCount} to go!` : ''}`}
          </p>
          {completedCount < 8 && (
            <Link to="/learn" className="btn btn-primary" style={{ marginTop:'1rem' }}>Continue Learning →</Link>
          )}
        </div>
      </div>

      {/* Module table */}
      <section aria-labelledby="module-progress-heading">
        <h2 id="module-progress-heading" style={{ marginBottom:'1rem', fontSize:'1.1rem' }}>Module Progress</h2>
        <div className={styles.table} role="table" aria-label="Module progress table">
          <div className={styles.thead} role="row">
            <span role="columnheader">Module</span>
            <span role="columnheader">Status</span>
            <span role="columnheader">Quiz Score</span>
            <span role="columnheader">Last Visited</span>
          </div>
          {MODULES.map((m) => {
            const done     = !!progress.completed?.[m.id];
            const visited  = !!progress.lastVisited?.[m.id];
            const score    = progress.quizScores?.[m.id];
            const date     = progress.lastVisited?.[m.id]
              ? new Date(progress.lastVisited[m.id]).toLocaleDateString()
              : '—';
            const status   = done ? 'Complete' : visited ? 'In Progress' : 'Not Started';
            const statusCls = done ? 'badge-success' : visited ? 'badge-warning' : 'badge-info';
            return (
              <div key={m.id} className={styles.trow} role="row">
                <Link to={`/learn/${m.id}`} className={styles.modLink} role="cell">
                  {m.icon} {m.title}
                </Link>
                <span role="cell"><span className={`badge ${statusCls}`}>{status}</span></span>
                <span role="cell">{score !== undefined ? `${score}/5` : '—'}</span>
                <span role="cell" style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{date}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievements */}
      <section aria-labelledby="achievements-heading" style={{ marginTop:'2.5rem' }}>
        <h2 id="achievements-heading" style={{ marginBottom:'1rem', fontSize:'1.1rem' }}>Achievements</h2>
        <ul className={styles.achievements} role="list">
          {ACHIEVEMENTS.map((a) => (
            <li key={a.id} className={`card ${styles.achievement} ${earned.has(a.id) ? styles.earned : styles.locked}`}>
              <span className={styles.achIcon} aria-hidden="true">{a.icon}</span>
              <div>
                <strong>{a.title}</strong>
                <p>{a.desc}</p>
              </div>
              {!earned.has(a.id) && <span className={styles.lock} aria-label="Locked">🔒</span>}
            </li>
          ))}
        </ul>
      </section>
    </motion.div>
  );
}
