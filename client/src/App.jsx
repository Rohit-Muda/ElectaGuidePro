import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import Navbar        from './components/Navbar';
import Footer        from './components/Footer';
import FloatingChat  from './components/FloatingChat';

const Home         = lazy(() => import('./pages/Home'));
const Learn        = lazy(() => import('./pages/Learn'));
const ModuleDetail = lazy(() => import('./pages/ModuleDetail'));
const Chat         = lazy(() => import('./pages/Chat'));
const Quiz         = lazy(() => import('./pages/Quiz'));
const Glossary     = lazy(() => import('./pages/Glossary'));
const Progress     = lazy(() => import('./pages/Progress'));
const MythBuster   = lazy(() => import('./pages/MythBuster'));

function PageFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        flexDirection: 'column',
        gap: '0.75rem',
        color: 'var(--text-muted)',
      }}
      aria-busy="true"
      aria-label="Loading page"
    >
      <span style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⟳</span>
      <span style={{ fontSize: '0.9rem' }}>Loading…</span>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isChat   = location.pathname === '/chat';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" style={{ flexGrow: 1, flexShrink: 0, flexBasis: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Suspense fallback={<PageFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/"              element={<Home />} />
              <Route path="/learn"         element={<Learn />} />
              <Route path="/learn/:id"     element={<ModuleDetail />} />
              <Route path="/chat"          element={<Chat />} />
              <Route path="/quiz/:id"      element={<Quiz />} />
              <Route path="/glossary"      element={<Glossary />} />
              <Route path="/progress"      element={<Progress />} />
              <Route path="/myths"         element={<MythBuster />} />
              <Route path="*"             element={
                <div className="page container" style={{ textAlign:'center', paddingTop:'5rem' }}>
                  <h1>404</h1>
                  <p>Page not found.</p>
                </div>
              } />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      {!isChat && <FloatingChat />}
    </div>
  );
}
