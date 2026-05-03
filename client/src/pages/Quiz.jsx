import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useApp } from '../context/AppContext';
import ProgressRing from '../components/ProgressRing';
import styles from './Quiz.module.css';

const PAGE = { initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, exit:{opacity:0}, transition:{duration:0.3} };

export default function Quiz() {
  const { id }  = useParams();
  const navigate = useNavigate();
  const { saveQuizScore } = useApp();

  const [quiz,     setQuiz    ] = useState(null);
  const [loading,  setLoading ] = useState(true);
  const [error,    setError   ] = useState(null);
  const [current,  setCurrent ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers,  setAnswers ] = useState([]);
  const [done,     setDone    ] = useState(false);

  useEffect(() => {
    api.get(`/quiz/${id}`)
      .then((r) => setQuiz(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const q = quiz?.questions[current];

  const pick = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const next = () => {
    const updated = [...answers, { q: current, chosen: selected, correct: q.correct }];
    setAnswers(updated);

    if (current + 1 >= quiz.questions.length) {
      const score = updated.filter((a) => a.chosen === a.correct).length;
      saveQuizScore(parseInt(id, 10), score);
      api.post('/quiz/result', {
        moduleId: parseInt(id, 10), score,
        sessionId: localStorage.getItem('eg_session') || 'guest',
      }).catch(() => {});
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  if (loading) return <div className="page container" aria-busy="true"><p>Loading quiz…</p></div>;
  if (error)   return <div className="page container"><p role="alert" style={{ color:'var(--error)' }}>⚠️ {error}</p></div>;

  if (done) {
    const score = answers.filter((a) => a.chosen === a.correct).length;
    const pct   = Math.round((score / quiz.questions.length) * 100);
    const color = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--error)';
    return (
      <motion.div {...PAGE} className="page container">
        <div className={styles.result}>
          <ProgressRing value={score} max={quiz.questions.length} size={160} color={color} />
          <h1 style={{ marginTop:'1.25rem' }}>
            {pct >= 80 ? '🎉 Excellent!' : pct >= 50 ? '👍 Good effort!' : '📚 Keep learning!'}
          </h1>
          <p style={{ color:'var(--text-muted)', marginTop:'0.4rem' }}>
            You scored {score} out of {quiz.questions.length} on <strong>{quiz.moduleTitle}</strong>
          </p>
          <div className={styles.resultActions}>
            <button className="btn btn-outline" onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setDone(false); }}>
              🔄 Retake Quiz
            </button>
            <Link to="/learn" className="btn btn-primary">Back to Modules</Link>
            <Link to="/progress" className="btn btn-ghost">View Progress</Link>
          </div>
        </div>
      </motion.div>
    );
  }

  const isCorrect = selected === q.correct;

  return (
    <motion.div {...PAGE} className="page container">
      <Link to={`/learn/${id}`} className={styles.back}>← Back to Module</Link>

      <header className={styles.header}>
        <h1>{quiz.moduleTitle} — Quiz</h1>
        <div className="progress-bar-track" style={{ maxWidth:300 }} aria-label={`Question ${current+1} of ${quiz.questions.length}`}>
          <div className="progress-bar-fill" style={{ width:`${((current+1)/quiz.questions.length)*100}%` }} />
        </div>
        <p className={styles.counter}>Question {current + 1} of {quiz.questions.length}</p>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-40 }}
          transition={{ duration:0.2 }}
          className={`card ${styles.questionCard}`}
        >
          <p className={styles.qText}>{q.q}</p>

          <ul className={styles.options} role="list">
            {q.options.map((opt, i) => {
              let cls = styles.option;
              if (selected !== null) {
                if (i === q.correct) cls += ` ${styles.correct}`;
                else if (i === selected && i !== q.correct) cls += ` ${styles.wrong}`;
              }
              return (
                <li key={i}>
                  <button
                    className={cls}
                    onClick={() => pick(i)}
                    disabled={selected !== null}
                    aria-pressed={selected === i}
                    aria-label={`Option ${i+1}: ${opt}`}
                  >
                    <span className={styles.optLetter} aria-hidden="true">{String.fromCharCode(65+i)}</span>
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>

          {selected !== null && (
            <motion.div
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              className={`${styles.feedback} ${isCorrect ? styles.feedbackOk : styles.feedbackBad}`}
            >
              <strong>{isCorrect ? '✅ Correct!' : `❌ Incorrect — Answer: ${q.options[q.correct]}`}</strong>
              <p>{q.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {selected !== null && (
        <button className="btn btn-primary" onClick={next} style={{ marginTop:'1.25rem' }}>
          {current + 1 < quiz.questions.length ? 'Next Question →' : 'See Results'}
        </button>
      )}
    </motion.div>
  );
}
