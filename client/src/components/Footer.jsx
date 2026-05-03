import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span aria-hidden="true">🗳️</span>
          <span>ElectaGuide<strong>Pro</strong></span>
          <p>Non-partisan election education powered by Google Gemini AI.</p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className={styles.links} role="list">
            <li><Link to="/learn">Learn</Link></li>
            <li><Link to="/chat">AI Chat</Link></li>
            <li><Link to="/glossary">Glossary</Link></li>
            <li><Link to="/myths">Myth Buster</Link></li>
            <li><Link to="/progress">Progress</Link></li>
          </ul>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} ElectaGuide Pro · For educational purposes only · Not affiliated with any government or political party</p>
      </div>
    </footer>
  );
}
