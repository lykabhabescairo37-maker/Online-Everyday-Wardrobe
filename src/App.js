import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State to control if the user has entered the website app
  const [hasEntered, setHasEntered] = useState(false);

  // Preset minimal capsule collection with localStorage persistence
  const defaultItems = [
    { id: 1, type: 'Top Layer', name: 'Oversized Boxy Tee', colorName: 'Mist Blue', colorHex: '#d0e1fd' },
    { id: 2, type: 'Top Layer', name: 'Washed Denim Jacket', colorName: 'Classic Indigo', colorHex: '#2b3a4a' },
    { id: 3, type: 'Bottom Layer', name: 'Relaxed Wide Trousers', colorName: 'Slate Blue', colorHex: '#4a5a6a' },
    { id: 4, type: 'Bottom Layer', name: 'Tailored Linen Shorts', colorName: 'Soft Cream', colorHex: '#fcfaf2' },
    { id: 5, type: 'Accessory', name: 'Minimalist Steel Watch', colorName: 'Metallic Silver', colorHex: '#e2e8f0' },
    { id: 6, type: 'Accessory', name: 'Classic Canvas Tote Bag', colorName: 'Navy Hue', colorHex: '#1e293b' }
  ];
  const [capsuleItems, setCapsuleItems] = useState(() => {
    const saved = localStorage.getItem('capsuleItems');
    return saved ? JSON.parse(saved) : defaultItems;
  });
  
  // Save to localStorage whenever capsuleItems changes
  useEffect(() => {
    localStorage.setItem('capsuleItems', JSON.stringify(capsuleItems));
  }, [capsuleItems]);

  // Track currently selected pieces for the mixer canvas
  const [selectedTop, setSelectedTop] = useState(capsuleItems[0]);
  const [selectedBottom, setSelectedBottom] = useState(capsuleItems[2]);
  const [selectedAcc, setSelectedAcc] = useState(capsuleItems[4]);

  // Track the saved weekly lookbook grid rotation
  const [weeklyLookbook, setWeeklyLookbook] = useState({
    Monday: { top: '— Not Set —', bottom: '— Not Set —', acc: '— Not Set —' },
    Tuesday: { top: '— Not Set —', bottom: '— Not Set —', acc: '— Not Set —' },
    Wednesday: { top: '— Not Set —', bottom: '— Not Set —', acc: '— Not Set —' },
    Thursday: { top: '— Not Set —', bottom: '— Not Set —', acc: '— Not Set —' },
    Friday: { top: '— Not Set —', bottom: '— Not Set —', acc: '— Not Set —' },
  });

  const handleItemSelect = (item) => {
    if (item.type === 'Top Layer') setSelectedTop(item);
    if (item.type === 'Bottom Layer') setSelectedBottom(item);
    if (item.type === 'Accessory') setSelectedAcc(item);
  };

  const saveToDay = (day) => {
    setWeeklyLookbook(prev => ({
      ...prev,
      [day]: {
        top: selectedTop.name,
        bottom: selectedBottom.name,
        acc: selectedAcc.name
      }
    }));
  };

  // Allow users to add custom items (tops, bottoms, accessories)
  const [customType, setCustomType] = useState('Accessory');
  const [customName, setCustomName] = useState('');
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#ffffff');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [showDescription, setShowDescription] = useState(false);

  const toggleDescription = () => setShowDescription(prev => !prev);

  const removeItem = (itemId) => {
    setCapsuleItems(prev => {
      const nextItems = prev.filter(item => item.id !== itemId);
      const removedItem = prev.find(item => item.id === itemId);
      if (!removedItem) return prev;

      if (removedItem.type === 'Top Layer' && selectedTop?.id === itemId) {
        const nextTop = nextItems.find(item => item.type === 'Top Layer') || { id: null, type: 'Top Layer', name: '—No Top—', colorName: 'Not available', colorHex: '#d1d5db' };
        setSelectedTop(nextTop);
      }
      if (removedItem.type === 'Bottom Layer' && selectedBottom?.id === itemId) {
        const nextBottom = nextItems.find(item => item.type === 'Bottom Layer') || { id: null, type: 'Bottom Layer', name: '—No Bottom—', colorName: 'Not available', colorHex: '#d1d5db' };
        setSelectedBottom(nextBottom);
      }
      if (removedItem.type === 'Accessory' && selectedAcc?.id === itemId) {
        const nextAcc = nextItems.find(item => item.type === 'Accessory') || { id: null, type: 'Accessory', name: '—No Accessory—', colorName: 'Not available', colorHex: '#d1d5db' };
        setSelectedAcc(nextAcc);
      }

      return nextItems;
    });
  };

  const addCustomItem = () => {
    if (!customName) return;
    const newItem = {
      id: capsuleItems.length + 1,
      type: customType,
      name: customName,
      colorName: customColorName || 'Custom',
      colorHex: customColorHex || '#cccccc',
      imageUrl: customImageUrl || undefined
    };
    setCapsuleItems(prev => [...prev, newItem]);
    // reset fields
    setCustomName('');
    setCustomColorName('');
    setCustomColorHex('#ffffff');
    setCustomImageUrl('');
  };

  // Simple recommendation engine: produce up to 4 suggested combinations
  const getRecommendations = () => {
    const tops = capsuleItems.filter(i => i.type === 'Top Layer');
    const bottoms = capsuleItems.filter(i => i.type === 'Bottom Layer');
    const accs = capsuleItems.filter(i => i.type === 'Accessory');

    const recs = [];
    for (let t of tops) {
      for (let b of bottoms) {
        for (let a of accs) {
          if (recs.length >= 4) break;
          // prefer combos different from current selection
          if (t.id === selectedTop.id && b.id === selectedBottom.id && a.id === selectedAcc.id) continue;
          recs.push({ top: t, bottom: b, acc: a });
        }
        if (recs.length >= 4) break;
      }
      if (recs.length >= 4) break;
    }
    return recs;
  };

  const applyRecommendation = (rec) => {
    setSelectedTop(rec.top);
    setSelectedBottom(rec.bottom);
    setSelectedAcc(rec.acc);
  };

  // 🌟 CONDITION 1: SHOW ONLY THE CUTE WELCOME GATE INTERFACE
  if (!hasEntered) {
    return (
      <div className="landing-gate-screen">
        <div className="gate-card">
          <span className="gate-badge">Your Cozy Styling Corner ✦</span>
          <h1>Welcome to Everyday Wardrobe!</h1>
          <p>
            Let's make getting dressed fun and effortless. Mix, match, and curate your 
            favorite aesthetic layers into a clean weekly rotation that fits your daily vibe.
          </p>
          <button className="enter-app-btn" onClick={() => setHasEntered(true)}>
            Let's Start ✨
          </button>
        </div>
      </div>
    );
  }

  // 🌟 CONDITION 2: THE INNER CLEAN APP (Shows up only after clicking the button)
  return (
    <div className="modern-app-container">
      
      {/* MINIMAL TOP NAV BAR */}
      <header className="app-minimal-nav">
        <div className="nav-brand">Everyday Wardrobe ✨</div>
        <div className="nav-control-group">
          <div className="nav-home-group">
            <button className="nav-back-btn" onClick={() => setHasEntered(false)}>🏠 Home</button>
            <button className="info-btn" onClick={toggleDescription}>❔</button>
          </div>
        </div>
      </header>

      {showDescription ? (
        <div className="site-description full-screen-description">
          <div className="site-description-header">
            <span>Everyday Wardrobe Guide</span>
            <button className="close-description-btn" onClick={toggleDescription}>✕</button>
          </div>
          <p>A friendly wardrobe planner to help you build outfits, add accessories you already own, and save a weekly rotation that makes styling faster.</p>
          <ul>
            <li><strong>Select items</strong> from the capsule to create a look.</li>
            <li><strong>Add your own pieces</strong> using the custom item form.</li>
            <li><strong>Use recommendations</strong> when you want new outfit ideas.</li>
            <li><strong>Save looks</strong> into your weekly schedule for easy planning.</li>
          </ul>
          <p className="description-followup">Click the close icon to return to your wardrobe workspace.</p>
        </div>
      ) : (
        <>
          <main className="workspace-layout">
        
        {/* THE CURATED CLOSET (LEFT SIDE) */}
        <section className="closet-panel">
          <div className="section-header">
            <h2>Your Capsule Matrix</h2>
            <p>Select items below to dynamically assemble your look.</p>
          </div>
          
          <div className="matrix-sections">
            {['Top Layer', 'Bottom Layer', 'Accessory'].map((category) => (
              <div key={category} className="matrix-category">
                <div className="matrix-category-header">{category}</div>
                <div className="matrix-row">
                  {capsuleItems.filter(item => item.type === category).map((item) => {
                    const isSelected = 
                      selectedTop.id === item.id || 
                      selectedBottom.id === item.id || 
                      selectedAcc.id === item.id;

                    return (
                      <div 
                        key={item.id} 
                        className={`item-card ${isSelected ? 'selected-card' : ''}`}
                        onClick={() => handleItemSelect(item)}
                      >
                        <button
                          className="item-delete-btn"
                          onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                          title="Remove this item"
                        >
                          ✕
                        </button>
                        <div className="card-top-meta">
                          <span className="category-label">{item.type}</span>
                          <span className="color-indicator-dot" style={{ backgroundColor: item.colorHex }}></span>
                        </div>
                        {item.imageUrl && (
                          <div className="item-thumbnail">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                            />
                          </div>
                        )}
                        <h3>{item.name}</h3>
                        <span className="color-text-tag">{item.colorName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="custom-add-section card-block matrix-custom-section">
            <h4>Add Your Own Item</h4>
            <div className="custom-form-row">
              <select value={customType} onChange={(e) => setCustomType(e.target.value)}>
                <option>Top Layer</option>
                <option>Bottom Layer</option>
                <option>Accessory</option>
              </select>
              <input placeholder="Name (e.g. Grandma Cardigan)" value={customName} onChange={e => setCustomName(e.target.value)} />
            </div>
            <div className="custom-form-row">
              <input placeholder="Color Name (optional)" value={customColorName} onChange={e => setCustomColorName(e.target.value)} />
              <input type="color" value={customColorHex} onChange={e => setCustomColorHex(e.target.value)} />
            </div>
            <div className="custom-form-row">
              <input placeholder="Image URL (optional)" value={customImageUrl} onChange={e => setCustomImageUrl(e.target.value)} />
            </div>
            <div className="form-actions-row">
              <button onClick={addCustomItem} className="add-item-btn">➕ Add Item</button>
              <button onClick={() => { setCustomName(''); setCustomColorName(''); setCustomColorHex('#ffffff'); }} className="clear-item-btn">✕ Clear</button>
            </div>
          </div>
        </section>

        {/* LIVE MIXER CANVAS & ROTATION (RIGHT SIDE) */}
        <section className="mixer-panel">
          <div className="preview-display-card">
            <div className="card-header-accent">Active Manifest Look</div>
            
            <div className="combination-rows">
              <div className="combo-row">
                <span className="label">Top Layer:</span>
                <span className="value">{selectedTop.name} <small>({selectedTop.colorName})</small></span>
              </div>
              <div className="combo-row">
                <span className="label">Bottom Layer:</span>
                <span className="value">{selectedBottom.name} <small>({selectedBottom.colorName})</small></span>
              </div>
              <div className="combo-row">
                <span className="label">Accessory:</span>
                <span className="value">{selectedAcc.name} <small>({selectedAcc.colorName})</small></span>
              </div>
            </div>

            <div className="dispatcher-container">
              <p>Save this outfit to a day in your weekly rotation:</p>
              <div className="day-button-container">
                {Object.keys(weeklyLookbook).map((day) => (
                  <button key={day} onClick={() => saveToDay(day)} className="action-day-btn" title={`Save current outfit for ${day}`}>
                    Save {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="recommendations-section card-block">
                <h4>Recommended Fits</h4>
                <p className="small-muted">Tap to apply a suggested look or use it for inspiration.</p>
                <div className="recommendation-list">
                  {getRecommendations().map((rec, idx) => (
                    <div key={idx} className="recommendation-card">
                      <div className="rec-summary"><strong>{rec.top.name}</strong> + <strong>{rec.bottom.name}</strong> + <em>{rec.acc.name}</em></div>
                      <div className="rec-actions">
                        <button onClick={() => applyRecommendation(rec)}>👁️ View</button>
                        <button onClick={() => { setSelectedTop(rec.top); setSelectedBottom(rec.bottom); saveToDay(Object.keys(weeklyLookbook)[0]); }}>💾 Save</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </section>

      </main>


      {/* THE ORGANIZED LOOKBOOK SCHEDULE (BOTTOM) */}
      <section className="lookbook-schedule-section">
        <div className="section-header">
          <h2>Weekly Rotation Schedule</h2>
          <p>Your saved outfit blueprints organized by day.</p>
        </div>

        <div className="schedule-cards-row">
          {Object.entries(weeklyLookbook).map(([day, outfit]) => (
            <div key={day} className="schedule-column-card">
              <div className="column-day-title">{day}</div>
              <div className="column-outfit-details">
                <p><strong>T:</strong> {outfit.top}</p>
                <p><strong>B:</strong> {outfit.bottom}</p>
                <p><strong>A:</strong> {outfit.acc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="workspace-footer">
        <p>Everyday Wardrobe Studio // Designed Clean & Eye-Friendly</p>
      </footer>
        </>
      )}
    </div>
  );
}

export default App;