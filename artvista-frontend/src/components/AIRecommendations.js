import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AIRecommendations = () => {
  const [suggestions, setSuggestions] = useState({});
  const [galleryMap, setGalleryMap] = useState({});
  const [galleryList, setGalleryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    // fetch site gallery to prefer local images/urls when possible
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/gallery`);
        if (!res.ok) return;
        const arts = await res.json();
        const map = {};
        (arts || []).forEach(a => {
          if (a.title) map[a.title.toLowerCase()] = a;
        });
        setGalleryMap(map);
        setGalleryList(arts || []);
      } catch (e) {
        // ignore
      }
    };

    fetchGallery();
    // expose gallery list globally for fuzzy matching by ArtworkCard
    // will be set once fetchGallery completes and sets galleryList
  }, []);

  // sync a global variable for use inside nested components
  useEffect(() => {
    try { window.__ART_GALLERY_LIST__ = galleryList || []; } catch (e) {}
  }, [galleryList]);

  const fetchSuggestions = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const userId = (user && (user.id || user._id)) || '1'; // fallback demo user
      if (!user) setInfo('Log in to see personalized recommendations based on your progress.');
      console.log('Fetching smart recommendations for user:', userId);

      // determine backend base URL with sensible fallbacks for local dev
      const base = process.env.REACT_APP_BACKEND_URL || window.REACT_APP_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');
      if (!base) {
        const msg = 'Backend URL not configured (REACT_APP_BACKEND_URL)';
        console.error(msg);
        setError(msg);
        return;
      }

      const requestUrl = `${base.replace(/\/$/, '')}/api/ai/smart-suggestions/${userId}`;
      console.log('Smart recommendations request URL:', requestUrl);

      const response = await fetch(requestUrl);

      if (!response.ok) {
        // try to show helpful debug info (status + text)
        const statusText = `${response.status} ${response.statusText}`;
        const bodyText = await response.text().catch(() => 'Unable to read response body');
        console.error('Error fetching recommendations:', statusText, bodyText);
        setError(`Could not fetch recommendations (${statusText}). ${bodyText.slice(0,200)}`);
        return;
      }

      const data = await response.json().catch(err => {
        console.error('Invalid JSON from smart suggestions:', err);
        setError('Invalid JSON received from service.');
        return null;
      });
      if (!data) return;

      // Handle smart recommendations format
      const recommendations = data.recommendations || {};
      const normalized = {
        artworks: (recommendations.artworks) || [],
        tutorials: (recommendations.tutorials) || [],
        learningPaths: (recommendations.learningPaths) || [],
        message: data.message || '',
        stats: data.stats || {}
      };

      if (normalized.artworks.length > 0 || normalized.tutorials.length > 0 || normalized.learningPaths.length > 0) {
        setSuggestions(normalized);
        // scroll recommendations into view for immediate feedback
        setTimeout(() => {
          const el = document.querySelector('[data-ai-recommendations]');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      } else {
        setInfo('No recommendations available yet. Start a learning path to get personalized suggestions!');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Error loading recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "white",
      borderRadius: "15px",
      padding: "25px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
      border: "1px solid #FFE5EC"
    }}>
      <h2 style={{ 
        fontSize: "2.2rem", 
        color: "#FF6A88",
        marginBottom: "20px"
      }}>
        <img src="/icons/ai-icon.png" alt="AI" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
        AI Recommendations
      </h2>
      <p style={{ color: "#666", fontSize: "1.1rem" }}>
        Get personalized art suggestions based on your preferences and browsing history.
      </p>
      <button style={{
        marginTop: "15px",
        background: loading ? "#cccccc" : "#FF6A88",
        color: "white",
        border: "none",
        padding: "10px 25px",
        borderRadius: "30px",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        transition: "all 0.3s"
      }}
      onClick={fetchSuggestions}
      onMouseEnter={e => {
        if (!loading) {
          e.target.style.background = "#ff5a7a";
          e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
        }
      }}
      onMouseLeave={e => {
        if (!loading) {
          e.target.style.background = "#FF6A88";
          e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
        }
      }}
      disabled={loading}
      >
        {loading ? 'Loading...' : 'Get Recommendations'}
      </button>
      {error && (
        <div style={{ marginTop: 18, color: '#b00020' }}>{error}</div>
      )}
      {info && (
        <div style={{ marginTop: 12, color: '#006064' }}>{info}</div>
      )}

      {( (suggestions.artworks && suggestions.artworks.length>0) || (suggestions.tutorials && suggestions.tutorials.length>0) || (suggestions.learningPaths && suggestions.learningPaths.length>0) ) && !error && (
        <div style={{ marginTop: 20 }} data-ai-recommendations>
          {/* Next steps message */}
          {suggestions.message && (
            <div style={{ 
              background: '#FFF3E0', 
              border: '2px solid #FF9800',
              padding: '15px', 
              borderRadius: '10px', 
              marginBottom: '20px',
              color: '#E65100',
              fontWeight: 'bold',
              fontSize: '1.05rem'
            }}>
              🎯 {suggestions.message}
            </div>
          )}

          {/* Stats */}
          {suggestions.stats && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ background: '#F3E5F5', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#9C27B0', fontWeight: 'bold' }}>{suggestions.stats.completedLearningPaths || 0}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Paths Completed</div>
              </div>
              <div style={{ background: '#E3F2FD', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#2196F3', fontWeight: 'bold' }}>{suggestions.stats.inProgressLearningPaths || 0}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>In Progress</div>
              </div>
              <div style={{ background: '#FFF3E0', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#FF9800', fontWeight: 'bold' }}>{suggestions.stats.totalFavorites || 0}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Saved Artworks</div>
              </div>
            </div>
          )}

          {/* Learning Paths recommendations */}
          {(suggestions.learningPaths || []).length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#FF6A88', fontSize: '1.3rem', marginBottom: '12px' }}>📚 Recommended Learning Paths</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(suggestions.learningPaths || []).map((path, idx) => (
                  <div key={idx} style={{
                    background: '#F5F5F5',
                    padding: '15px',
                    borderRadius: '10px',
                    border: path.status === 'continue' ? '2px solid #FF6A88' : '1px solid #ddd'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: '#333' }}>{path.title}</h4>
                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>{path.description}</p>
                      </div>
                      <span style={{
                        background: path.status === 'continue' ? '#FF6A88' : '#9C27B0',
                        color: 'white',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                        marginLeft: '10px'
                      }}>
                        {path.status === 'continue' ? `${path.progress}% Complete` : 'Get Started'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#666' }}>
                      <span>{path.difficulty} • {path.duration}h • {path.completedModules}/{path.totalModules} modules</span>
                    </div>
                    {path.status === 'continue' && (
                      <div style={{ marginTop: '8px', background: '#fff', padding: '6px', borderRadius: '4px' }}>
                        <div style={{
                          height: '6px',
                          background: '#ddd',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            background: '#FF6A88',
                            width: `${path.progress}%`,
                            transition: 'width 0.3s'
                          }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Artworks grid */}
          {(suggestions.artworks || []).length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#FF6A88', fontSize: '1.3rem', marginBottom: '12px' }}>🎨 Recommended Artworks</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 12 }}>
                {(suggestions.artworks || []).map((art, i) => (
                  <ArtworkCard key={i} art={art} galleryMap={galleryMap} />
                ))}
              </div>
            </div>
          )}

          {/* Tutorials list */}
          {(suggestions.tutorials || []).length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#FF6A88', fontSize: '1.3rem', marginBottom: '12px' }}>📖 Blog & Tutorials</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(suggestions.tutorials || []).map((tut, idx) => (
                  <TutorialItem key={idx} tut={tut} />
                ))}
              </div>
            </div>
          )}

          {/* No content fallback */}
          {((suggestions.artworks || []).length === 0 && (suggestions.tutorials || []).length === 0 && (suggestions.learningPaths || []).length === 0) && (
            <div style={{ marginTop: 12, color: '#666' }}>No recommendations available yet. Explore learning paths and gallery to get started!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;

// SaveButton component: saves an artwork to the user's favorites via backend
function SaveButton({ art }) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const saveArtwork = async () => {
    if (!user) {
      setMsg('Log in to save');
      return;
    }

    setSaving(true);
    setMsg('');
    try {
      const token = localStorage.getItem('token');
      const userId = user.id || user._id;
      const artworkId = art.id || art._id || art.externalId || art.url || art.title || 'unknown';

      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/profile/${userId}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ artworkId })
      });

      if (res.ok) {
        setMsg('Saved');
      } else {
        const data = await res.json().catch(() => ({}));
        setMsg(data.error || 'Could not save');
      }
    } catch (err) {
      setMsg('Network error');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 2500);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button onClick={saveArtwork} disabled={saving} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: saving ? '#eee' : '#fff' }}>
        {saving ? 'Saving...' : 'Save'}
      </button>
      {msg && <div style={{ fontSize: 12, color: '#666' }}>{msg}</div>}
    </div>
  );
}

function ArtworkCard({ art, galleryMap }) {
  const title = (art.title || art.name || '').trim();
  const [copied, setCopied] = useState(false);
  // helper: try exact local match first, then fuzzy match against galleryList in window (passed via global)
  const findLocal = () => {
    try {
      const galleryList = window.__ART_GALLERY_LIST__ || [];
      const key = title.toLowerCase();
      let exact = null;
      for (const g of galleryList) {
        if ((g.title || '').toLowerCase() === key) { exact = g; break; }
      }
      if (exact) return exact;

      // fuzzy: split words and find gallery with most overlapping words
      const tokens = key.split(/\W+/).filter(Boolean);
      let best = null; let bestScore = 0;
      for (const g of galleryList) {
        const gKey = (g.title || '').toLowerCase();
        const gTokens = gKey.split(/\W+/).filter(Boolean);
        let score = 0;
        tokens.forEach(t => { if (gTokens.includes(t)) score++; });
        if (score > bestScore) { bestScore = score; best = g; }
      }
      if (bestScore > 0) return best;
    } catch (e) {
      // ignore
    }
    return null;
  };

  const local = findLocal();
  const imageSrc = (local && local.imageUrl) || art.image || styleImageFallback(art.style || art.medium) || '/images/artwork19.avif';
  const viewUrl = local ? `/gallery?highlight=${encodeURIComponent(local.title || title)}` : (art.url || art.image || '#');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(title || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <div style={{ borderRadius: 10, padding: 10, background: '#fff', border: '1px solid #eee' }}>
      <img src={imageSrc} alt={title} style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
      <div style={{ fontWeight: 800 }}>{title}</div>
      <div style={{ color: '#666', fontSize: 13 }}>{art.artist || art.author || art.by}</div>
      <div style={{ marginTop: 8, color: '#444', fontSize: 13 }}>{art.description || art.excerpt || art.summary}</div>
      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
        <a href={viewUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: '#FF6A88', color: 'white' }}>View</button>
        </a>
        <button onClick={handleCopy} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: 'white' }}>{copied ? 'Copied!' : 'Copy title'}</button>
        <SaveButton art={art} />
      </div>
    </div>
  );
}

function TutorialItem({ tut }) {
  const [url, setUrl] = useState(tut.url || '');
  const [savedMsg, setSavedMsg] = useState('');

  const openTutorial = () => {
    if (!url) {
      setSavedMsg('No URL — click Add URL');
      setTimeout(() => setSavedMsg(''), 1800);
      return;
    }
    window.open(url, '_blank', 'noopener');
  };

  const addUrl = () => {
    const v = window.prompt('Paste the tutorial URL (YouTube or other):', '');
    if (v) {
      setUrl(v.trim());
      setSavedMsg('URL set');
      setTimeout(() => setSavedMsg(''), 1800);
    }
  };

  return (
    <div style={{ padding: 12, borderRadius: 8, background: '#fff', border: '1px solid #eee' }}>
      <div style={{ fontWeight: 700 }}>{tut.title || tut.name}</div>
      <div style={{ color: '#666', fontSize: 13, marginTop: 6 }}>{tut.description || tut.excerpt || ''}</div>
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <div style={{ fontSize: 13, color: '#444' }}><strong>Duration:</strong> {tut.duration || '15-30 min'}</div>
        <div style={{ fontSize: 13, color: '#444' }}><strong>Level:</strong> {tut.level || tut.difficulty || 'Beginner'}</div>
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={openTutorial} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: '#2a9d8f', color: 'white' }}>Open Tutorial</button>
        <button onClick={addUrl} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}>{url ? 'Edit URL' : 'Add URL'}</button>
        {savedMsg && <div style={{ fontSize: 12, color: '#666' }}>{savedMsg}</div>}
      </div>
    </div>
  );
}

// Simple fallback image chooser based on style/medium
function styleImageFallback(style) {
  if (!style) return null;
  const s = style.toLowerCase();
  if (s.includes('landscape')) return '/images/artwork15.jpg';
  if (s.includes('urban') || s.includes('city')) return '/images/artwork16.jpg';
  if (s.includes('portrait')) return '/images/artwork12.jpg';
  if (s.includes('abstract') || s.includes('digital')) return '/images/artwork19.avif';
  if (s.includes('nature')) return '/images/artwork13.jpg';
  return null;
}