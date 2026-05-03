import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useApp } from '../context/AppContext';
import styles from './ModuleDetail.module.css';

const PAGE = { initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, exit:{opacity:0}, transition:{duration:0.3} };

/* Very simple Markdown → HTML (no library needed for our controlled content) */
function renderMd(text = '') {
  return text
    .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
    .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^> (.+)$/gm,  '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\| (.+) \|$/gm, (_, row) => {
      const cells = row.split(' | ').map((c) => {
        if (c.match(/^[-:]+$/)) return null;
        return `<td>${c}</td>`;
      }).filter(Boolean);
      return cells.length ? `<tr>${cells.join('')}</tr>` : '';
    })
    .replace(/(<tr>[\s\S]+?<\/tr>)+/g, (t) => `<table>${t}</table>`)
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)/g, (l) => `<ol>${l}</ol>`)
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|b|t|o|u|l|p|c])/gm, '');
}

export default function ModuleDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { markComplete, markVisited, progress } = useApp();
  const [mod,       setMod    ] = useState(null);
  const [loading,   setLoading] = useState(true);
  const [error,     setError  ] = useState(null);
  const [marked,    setMarked ] = useState(false);
  const [toast,     setToast  ] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    setLoading(true); setError(null);
    const moduleId = parseInt(id, 10);
    api.get(`/modules/${moduleId}`)
      .then((r) => { setMod(r.data); markVisited(moduleId); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (mod) setMarked(!!progress.completed?.[mod.id]);
  }, [mod, progress]);

  const handleComplete = () => {
    markComplete(mod.id);
    setMarked(true);
    setToast('✅ Module marked as complete!');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <motion.div {...PAGE}>
      <div className="page container">
        <Link to="/learn" className={styles.back} aria-label="Back to all modules">← All Modules</Link>

        {loading && (
          <div aria-busy="true" aria-label="Loading module content">
            <div className="skeleton" style={{ height:40, marginBottom:'1rem', maxWidth:400 }} />
            {Array.from({length:6}).map((_,i) => (
              <div key={i} className="skeleton" style={{ height:18, marginBottom:10, maxWidth: i%2===0?'100%':'75%' }} />
            ))}
          </div>
        )}

        {error && <p role="alert" style={{ color:'var(--error)' }}>⚠️ {error}</p>}

        {mod && !loading && (
          <>
            <header className={styles.header}>
              <span className={styles.icon} aria-hidden="true">{mod.icon}</span>
              <div>
                <p className="section-label">Module {mod.id} · {mod.difficulty} · {mod.readTime}</p>
                <h1>{mod.title}</h1>
                {mod.demo && (
                  <p className={styles.demoNote} role="status">
                    ℹ️ Showing curated content — add a Gemini API key for AI-generated explanations.
                  </p>
                )}
              </div>
            </header>

            <div
              ref={contentRef}
              className={`card md-content ${styles.content}`}
              dangerouslySetInnerHTML={{ __html: renderMd(mod.content) }}
            />

            <div className={styles.actions}>
              {!marked ? (
                <button className="btn btn-primary" onClick={handleComplete} aria-label="Mark this module as complete">
                  ✅ Mark as Complete
                </button>
              ) : (
                <span className="badge badge-success" style={{ padding:'0.5rem 1rem', fontSize:'0.9rem' }}>
                  ✅ Completed!
                </span>
              )}
              <Link to={`/quiz/${mod.id}`} className="btn btn-outline" aria-label={`Take quiz for ${mod.title}`}>
                📝 Take Quiz
              </Link>
              <Link
                to="/chat"
                state={{ context: `I just read about "${mod.title}". I have a follow-up question:` }}
                className="btn btn-ghost"
                aria-label="Ask a follow-up question about this module"
              >
                💬 Ask Follow-up
              </Link>
            </div>
          </>
        )}
      </div>

      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </motion.div>
  );
}
