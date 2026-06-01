import React, { useRef, useState } from 'react';
import './Landing.css';

export default function Landing({ onStart }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);
  const handle = f => { if(!f?.name.endsWith('.pdf')){alert('PDF files only');return;} onStart(f,false); };

  return (
    <div className="land">
      <div className="land-bg" />
      <aside className="land-side">
        <div className="side-logo">
          <span className="side-ghost">👻</span>
          <span className="side-name">Citation<br/>Ghost</span>
        </div>
        <nav className="side-nav">
          <div className="nav-item active">Forensic Analysis</div>
          <div className="nav-item dim">Hallucination Detection</div>
          <div className="nav-item dim">Distortion Detection</div>
          <div className="nav-item dim">Trust-Me-Bro</div>
          <div className="nav-item dim">Reference Quality</div>
          <div className="nav-item dim">Source Diversity</div>
          <div className="nav-item dim">Citation Network</div>
        </nav>
        <div className="side-bottom">
          <div className="side-tag">v2.0 · Research Integrity</div>
          <div className="side-tag" style={{color:'rgba(26,107,58,0.7)'}}>✓ No account needed</div>
        </div>
      </aside>

      <main className="land-main">
        <div className="land-sheet">
          <div className="sheet-rule-top" />
          <header className="sheet-header">
            <div className="sh-eyebrow">FORENSIC CITATION LABORATORY · CASE FILE #0001</div>
            <h1 className="sh-title">Does your paper's<br/><em>citations</em> hold up?</h1>
            <p className="sh-desc">Upload any research PDF. CitationGhost extracts every cited claim, fetches original sources, and runs a full forensic analysis — hallucinations, distortions, overclaims, missing citations, and more.</p>
          </header>

          <div
            className={`drop-zone ${drag?'active':''}`}
            onDragEnter={e=>{e.preventDefault();setDrag(true)}}
            onDragLeave={()=>setDrag(false)}
            onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();setDrag(false);handle(e.dataTransfer.files[0])}}
            onClick={()=>ref.current.click()}
          >
            <input ref={ref} type="file" accept=".pdf" style={{display:'none'}} onChange={e=>handle(e.target.files[0])} />
            <div className="dz-inner">
              <div className="dz-icon">📄</div>
              <p className="dz-main">Drop your PDF here</p>
              <p className="dz-sub">Click to browse · research papers · max 30 pages</p>
            </div>
          </div>

          <div className="demo-row">
            <div className="or-line"><span>or try a demo</span></div>
            <button className="demo-btn" onClick={()=>onStart(null,true)}>
              <span className="demo-icon">⚡</span>
              <div>
                <span className="demo-label">Run demo analysis</span>
                <span className="demo-paper">"Attention Is All You Need" — Vaswani et al. 2017</span>
              </div>
              <span className="demo-arrow">→</span>
            </button>
            <p className="demo-note">Pre-loaded results · see all features in action</p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f,i)=>(
              <div key={i} className="feat-card">
                <span className="feat-icon">{f.icon}</span>
                <div>
                  <div className="feat-name">{f.name}</div>
                  <div className="feat-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="sheet-rule-bot" />
        </div>
      </main>
    </div>
  );
}

const FEATURES = [
  {icon:'👻',name:'Hallucination Detection',desc:'Source says nothing of the sort'},
  {icon:'⚠',name:'Distortion Detection',desc:'Claim exaggerates the original'},
  {icon:'🔍',name:'Exact Evidence Line',desc:'Pinpoint phrase from source abstract'},
  {icon:'💪',name:'Trust-Me-Bro Detector',desc:'Strong claim, weak evidence'},
  {icon:'❓',name:'Missing Citations',desc:'Claims with zero references'},
  {icon:'📊',name:'Reference Quality',desc:'Peer-reviewed vs blog vs preprint'},
  {icon:'🕸',name:'Citation Network',desc:'Who cites whom — visualized'},
  {icon:'📜',name:'Integrity Certificate',desc:'Shareable proof of analysis'},
];
