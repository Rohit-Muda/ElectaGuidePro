import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/learn',    label: 'Learn'     },
  { to: '/chat',     label: 'AI Chat'   },
  { to: '/glossary', label: 'Glossary'  },
  { to: '/myths',    label: 'Myth Buster'},
  { to: '/progress', label: 'Progress'  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header} role="banner">
      <nav className={styles.nav} aria-label="Main navigation">
        <Link to="/" className={styles.logo} aria-label="ElectaGuide Pro home">
          <span aria-hidden="true">🗳️</span>
          <span>ElectaGuide<strong>Pro</strong></span>
        </Link>

        {/* Desktop links */}
        <ul className={styles.links} role="list">
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link to="/learn" className={`btn btn-primary ${styles.cta}`}>
          Start Learning
        </Link>

        {/* Mobile hamburger */}
        <button
          className={styles.burger}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className={styles.mobile} role="navigation" aria-label="Mobile navigation">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
