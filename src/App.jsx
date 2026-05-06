import { useState, useEffect } from 'react';
import './index.css';

const API_URL = 'https://api.freeapi.app/api/v1/public/cats/cat/random';

const STATS = [
  { key: 'adaptability', label: 'Adaptability' },
  { key: 'affection_level', label: 'Affection' },
  { key: 'child_friendly', label: 'Child Friendly' },
  { key: 'dog_friendly', label: 'Dog Friendly' },
  { key: 'energy_level', label: 'Energy' },
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'social_needs', label: 'Social Needs' },
  { key: 'stranger_friendly', label: 'Stranger Friendly' },
];

const PawSvg = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="65" rx="22" ry="20"/>
    <ellipse cx="25" cy="35" rx="10" ry="13" transform="rotate(-15 25 35)"/>
    <ellipse cx="45" cy="22" rx="9" ry="12" transform="rotate(-5 45 22)"/>
    <ellipse cx="65" cy="25" rx="9" ry="12" transform="rotate(10 65 25)"/>
    <ellipse cx="78" cy="42" rx="10" ry="12" transform="rotate(20 78 42)"/>
  </svg>
);

function App() {
  const [cat, setCat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('cat-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cat-theme', theme);
  }, [theme]);

  const fetchCat = async () => {
    setIsLoading(true);
    setImgLoaded(false);
    setError(null);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to fetch');
      setCat(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCat(); }, []);

  const temperaments = cat?.temperament ? cat.temperament.split(',').map(t => t.trim()) : [];
  const links = [];
  if (cat?.wikipedia_url) links.push({ label: 'Wikipedia', url: cat.wikipedia_url });
  if (cat?.cfa_url) links.push({ label: 'CFA', url: cat.cfa_url });
  if (cat?.vetstreet_url) links.push({ label: 'VetStreet', url: cat.vetstreet_url });
  if (cat?.vcahospitals_url) links.push({ label: 'VCA Hospitals', url: cat.vcahospitals_url });

  return (
    <>
      <div className="paw-bg">
        {[1,2,3,4,5,6].map(i => <PawSvg key={i} className={`p${i}`} />)}
      </div>

      <nav className="navbar">
        <div className="nav-brand">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
          Purrfect
        </div>
        <div className="nav-right">
          <button className="theme-toggle" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} aria-label="Toggle theme">
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            )}
          </button>
        </div>
      </nav>

      <main className="main">
        <div className="hero-text">
          <h1>Meet your <span className="accent">new friend</span></h1>
          <p>Discover random cat breeds from around the world. Every click brings a new furry companion.</p>
        </div>

        {error && (
          <div className="error-state">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
          </div>
        )}

        {cat && !error && (
          <div className="cat-viewer" key={cat.id}>
            <div className="cat-image-card">
              <div className="cat-image-wrap">
                {!imgLoaded && <div className="img-loader"><div className="spinner spinner-dark"></div></div>}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className={imgLoaded ? '' : 'loading'}
                  onLoad={() => setImgLoaded(true)}
                />
              </div>
              <div className="cat-name-bar">
                <span className="cat-breed-name">{cat.name}</span>
                <span className="cat-origin-badge">{cat.origin}</span>
              </div>
            </div>

            <div className="cat-details-card">
              <div className="cat-temperament">
                {temperaments.map(t => <span key={t} className="temp-tag">{t}</span>)}
              </div>

              <p className="cat-description">{cat.description}</p>

              <div className="cat-stats-grid">
                {STATS.map(s => (
                  <div key={s.key} className="stat-item">
                    <span className="stat-label">{s.label}</span>
                    <div className="stat-bar">
                      <div className="stat-bar-fill" style={{ width: `${(cat[s.key] || 0) * 20}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cat-meta-row">
                <div className="cat-meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>Life span: <strong>{cat.life_span} yrs</strong></span>
                </div>
                <div className="cat-meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  <span>Weight: <strong>{cat.weight?.metric} kg</strong></span>
                </div>
                {cat.hypoallergenic === 1 && (
                  <div className="cat-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span><strong>Hypoallergenic</strong></span>
                  </div>
                )}
              </div>

              {links.length > 0 && (
                <div className="cat-links">
                  {links.map(l => (
                    <a key={l.label} className="cat-link" href={l.url} target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                      {l.label}
                    </a>
                  ))}
                </div>
              )}

              <button className="new-cat-btn" onClick={fetchCat} disabled={isLoading}>
                {isLoading ? <div className="spinner"></div> : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                    Show me another cat!
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
