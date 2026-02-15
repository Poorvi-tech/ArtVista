import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ArtCreationSuggestions = () => {
  const [suggestions, setSuggestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');
  const { user } = useAuth();

  const fetchSuggestions = async () => {
    if (!user) {
      alert('Please log in to get personalized creative suggestions.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ai/art-creation/${user.id || user._id}`);
      const data = await response.json();
      
      if (response.ok) {
        setSuggestions(data);
      } else {
        console.error('Error fetching art creation suggestions:', data.error);
        alert('Could not fetch creative suggestions. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching art creation suggestions:', error);
      alert('An error occurred while fetching creative suggestions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "22px",
      boxShadow: "0 8px 30px rgba(13,38,59,0.06)",
      border: "1px solid #F3E7EC",
      maxWidth: 900
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#FF5A7A' }}>Art Creation Suggestions</h2>
          <p style={{ margin: '6px 0 0', color: '#666' }}>Practical, step-by-step inspiration and material guidance to start a new artwork right now.</p>
        </div>
        <div>
          <button
            onClick={fetchSuggestions}
            disabled={loading}
            style={{
              background: loading ? '#ddd' : '#FF6A88',
              color: 'white',
              border: 'none',
              padding: '10px 18px',
              borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600
            }}
          >{loading ? 'Loading...' : 'Get Creative Ideas'}</button>
        </div>
      </div>

      {/* Empty state */}
      {!suggestions || Object.keys(suggestions).length === 0 ? (
        <div style={{ marginTop: 18, color: '#555' }}>Click "Get Creative Ideas" to receive tailored palettes, techniques, and a short plan.</div>
      ) : (
        <div style={{ marginTop: 18 }}>
          {/* Palettes */}
          {suggestions.colorPalettes && suggestions.colorPalettes.length > 0 && (
            <section style={{ marginBottom: 18 }}>
              <h3 style={{ color: '#FF6A88', marginBottom: 10 }}>Color Palettes</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {suggestions.colorPalettes.slice(0,6).map((p, i) => {
                  const colors = p.colors || p.palette || [];
                  return (
                    <div key={i} style={{ width: 220, borderRadius: 10, padding: 10, background: '#fafafa', border: '1px solid #eee' }}>
                      <div style={{ fontWeight: 700, color: '#333', marginBottom: 8 }}>{p.name}</div>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                        {colors.map((c, idx) => (
                          <div key={idx} style={{ flex: 1 }}>
                            <div style={{ height: 40, background: c, borderRadius: 6, border: '1px solid rgba(0,0,0,0.06)' }} />
                            <div style={{ textAlign: 'center', marginTop: 6, fontSize: 12, color: '#444' }}>
                              <button
                                onClick={() => { navigator.clipboard.writeText(c); setCopied(c); setTimeout(()=>setCopied(''),1400); }}
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: copied === c ? '#2a9d8f' : '#666' }}
                              >{c} {copied === c ? '✓' : ''}</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>Suggested uses: {p.uses || 'backgrounds, accents, and depth'}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Techniques */}
          {suggestions.techniques && suggestions.techniques.length > 0 && (
            <section style={{ marginBottom: 18 }}>
              <h3 style={{ color: '#FF6A88', marginBottom: 8 }}>Techniques & Materials</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {suggestions.techniques.map((t, i) => {
                  const technique = typeof t === 'string' ? { name: t, description: '' } : t;
                  return (
                    <div key={i} style={{ padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #eee' }}>
                      <div style={{ fontWeight: 700 }}>{technique.name}</div>
                      <div style={{ fontSize: 13, color: '#444', marginTop: 6 }}>{technique.description || technique.tip || 'No description available.'}</div>
                      <div style={{ marginTop: 8, fontSize: 13, color: '#555' }}>
                        <div><strong>Tools:</strong> {technique.tools || 'brushes, palette knife, paper/canvas'}</div>
                        <div><strong>Estimated time:</strong> {technique.time || '1-3 hrs'}</div>
                        <div><strong>Difficulty:</strong> {technique.difficulty || 'Intermediate'}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Themes & mini plan */}
          {suggestions.themes && suggestions.themes.length > 0 && (
            <section style={{ marginBottom: 18 }}>
              <h3 style={{ color: '#FF6A88', marginBottom: 8 }}>Themes & Quick Plan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {suggestions.themes.map((th, i) => {
                  const theme = typeof th === 'string' ? { name: th, description: '' } : th;
                  // Build a concise 4-step plan
                  const plan = [
                    `1) Reference & Composition: sketch main shapes for '${theme.name}'`,
                    `2) Choose palette: use ${suggestions.colorPalettes && suggestions.colorPalettes[0] ? suggestions.colorPalettes[0].name : 'recommended palette'}`,
                    `3) Apply base layers and build texture using ${suggestions.techniques && suggestions.techniques[0] ? (typeof suggestions.techniques[0] === 'string' ? suggestions.techniques[0] : suggestions.techniques[0].name) : 'layering techniques'}`,
                    `4) Final accents: add highlights and contrast; step back and refine.`
                  ];
                  return (
                    <div key={i} style={{ padding: 12, borderRadius: 8, background: '#fff', border: '1px solid #eee' }}>
                      <div style={{ fontWeight: 800 }}>{theme.name}</div>
                      <div style={{ color: '#444', marginTop: 6 }}>{theme.description || theme.prompt || 'A focused creative prompt to guide your composition.'}</div>
                      <ol style={{ marginTop: 8, color: '#333' }}>
                        {plan.map((p, idx) => <li key={idx} style={{ marginBottom: 6 }}>{p}</li>)}
                      </ol>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Footer notes */}
          <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>Tip: click any color code to copy it to clipboard. Use the quick plan as a starting point; adapt to your materials and style.</div>
        </div>
      )}
    </div>
  );
};

export default ArtCreationSuggestions;