import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ProgressRing from '../components/ProgressRing';
import styles from './Home.module.css';

const PAGE = { initial:{opacity:0,y:24}, animate:{opacity:1,y:0}, exit:{opacity:0,y:-16}, transition:{duration:0.3} };

const FEATURES = [
  { icon:'🤖', title:'AI-Powered Chat', desc:'Ask any election question and get clear, neutral, step-by-step answers powered by Google Gemini.', link:'/chat', cta:'Ask ElectaGuide' },
  { icon:'📚', title:'8 Learning Modules', desc:'From voter registration to how votes are counted — structured lessons with rich content.', link:'/learn', cta:'Start Learning' },
  { icon:'✅', title:'Quizzes & Progress', desc:'Test your knowledge after each module and track your journey to election readiness.', link:'/progress', cta:'View Progress' },
];

const READINESS_QUESTIONS = [
  { id:'q1', text:'Do you know if you are registered to vote?' },
  { id:'q2', text:'Do you know where your nearest polling station is?' },
  { id:'q3', text:'Do you understand how votes are counted in your country?' },
  { id:'q4', text:'Have you researched the candidates or parties?' },
  { id:'q5', text:'Do you know the key election date(s) this year?' },
];

const TIPS = [
  'Visit your government\'s voter registration portal to check your status.',
  'Search "[your city] polling station locator" to find your nearest location.',
  'Explore our "How Votes Are Counted" module to understand the process.',
  'Read candidate platforms on official party websites — stay non-partisan!',
  'Set a reminder! Check your country\'s official election commission website.',
];

export default function Home() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = Object.values(answers).filter(Boolean).length;
  const ringColor = score <= 2 ? 'var(--error)' : score <= 4 ? 'var(--warning)' : 'var(--success)';
  const label = score <= 2 ? 'Low Readiness' : score <= 4 ? 'Getting There' : 'Election Ready!';

  const toggle = (id) => setAnswers((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <motion.div {...PAGE}>
      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <p className="section-label">AI-Powered · Non-Partisan · Free</p>
            <h1 id="hero-heading">
              Understand Elections.<br />
              <span className={styles.gold}>Make Your Vote Count.</span>
            </h1>
            <p className={styles.heroSub}>
              ElectaGuide Pro uses Google Gemini AI to break down complex election processes
              into clear, easy-to-follow steps — from registration to results.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/learn" className="btn btn-primary" style={{ fontSize:'1rem', padding:'0.75rem 1.75rem' }}>
                Start Learning →
              </Link>
              <Link to="/chat" className="btn btn-outline">
                Ask AI Assistant
              </Link>
            </div>
          </div>
          <div className={styles.heroStats} aria-label="Global election statistics">
            {[
              { n:'2B+', l:'Voters Worldwide' },
              { n:'193', l:'Countries Hold Elections' },
              { n:'8',   l:'Modules to Master' },
            ].map(({ n, l }) => (
              <div key={l} className={styles.stat}>
                <strong>{n}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={`container ${styles.features}`} aria-labelledby="features-heading">
        <h2 id="features-heading" className="section-label" style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          What You Can Do
        </h2>
        <div className={styles.featureGrid}>
          {FEATURES.map(({ icon, title, desc, link, cta }, i) => (
            <motion.article
              key={title} className={`card ${styles.featureCard}`}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              <span className={styles.featureIcon} aria-hidden="true">{icon}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
              <Link to={link} className="btn btn-outline" style={{ marginTop:'auto', alignSelf:'flex-start' }}>
                {cta}
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── Readiness Widget ── */}
      <section className={`container ${styles.readiness}`} aria-labelledby="readiness-heading">
        <div className={styles.readinessCard}>
          <div className={styles.readinessLeft}>
            <p className="section-label">Quick Self-Assessment</p>
            <h2 id="readiness-heading">Election Readiness Check</h2>
            <p style={{ color:'var(--text-muted)', marginBottom:'1.5rem' }}>
              Answer 5 quick questions to see how prepared you are.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} noValidate>
              {READINESS_QUESTIONS.map(({ id, text }, i) => (
                <div key={id} className={styles.question}>
                  <label className={styles.qLabel} htmlFor={id}>
                    <input
                      type="checkbox" id={id} checked={!!answers[id]}
                      onChange={() => toggle(id)}
                      aria-checked={!!answers[id]}
                    />
                    <span>{text}</span>
                  </label>
                  {submitted && !answers[id] && (
                    <p className={styles.tip}>💡 {TIPS[i]}</p>
                  )}
                </div>
              ))}
              {!submitted && (
                <button type="submit" className="btn btn-primary" style={{ marginTop:'1rem' }}>
                  Check My Readiness
                </button>
              )}
            </form>
          </div>

          {submitted && (
            <motion.div
              className={styles.readinessRight}
              initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
            >
              <ProgressRing value={score} max={5} size={140} color={ringColor} label={label} />
              <p style={{ marginTop:'1rem', fontWeight:600, color: ringColor }}>{score}/5 — {label}</p>
              <Link to="/learn" className="btn btn-primary" style={{ marginTop:'1rem' }}>
                Improve My Score →
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
