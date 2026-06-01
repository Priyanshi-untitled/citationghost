import React,{useState} from 'react';
import {downloadCertificate} from '../lib/certificate';
import './Dashboard.css';

const VC={
  HALLUCINATED:{icon:'👻',color:'var(--red)',bg:'var(--red-bg)',label:'HALLUCINATED'},
  DISTORTED:{icon:'⚠',color:'var(--amber)',bg:'var(--amber-bg)',label:'DISTORTED'},
  SUPPORTED:{icon:'✓',color:'var(--green)',bg:'var(--green-bg)',label:'SUPPORTED'},
};

const TABS=['Claims','Trust-Me-Bro','Missing Citations','Ref Quality','Network'];

export default function Dashboard({results,onReset}){
  const {claims=[],missing=[],network={},quality,diversity,ghostScore,hallucinated,distorted,supported,total,summary,paperTitle,isDemo}=results;
  const [tab,setTab]=useState('Claims');
  const [filter,setFilter]=useState('ALL');
  const [certLoading,setCertLoading]=useState(false);
  const level=ghostScore<=20?'clean':ghostScore<=50?'moderate':'critical';
  const levelLabel=ghostScore<=20?'VERIFIED CLEAN':ghostScore<=50?'QUESTIONABLE':'COMPROMISED';
  const levelColor=ghostScore<=20?'var(--green)':ghostScore<=50?'var(--amber)':'var(--red)';
  const overclaims=claims.filter(c=>c.trustMeBro?.overclaim).length;
  const filtered=filter==='ALL'?claims:claims.filter(c=>c.verdict===filter);
  const handleCert=async()=>{setCertLoading(true);await downloadCertificate(results);setCertLoading(false);};

  return(
    <div className="dash">
      {/* Sidebar */}
      <aside className="dash-side">
        <div className="ds-top">
          <button className="ds-back" onClick={onReset}>← New Paper</button>
          <div className="ds-logo"><span style={{fontSize:'1.5rem',animation:'float 3s ease-in-out infinite',display:'inline-block'}}>👻</span><span className="ds-name">CitationGhost</span></div>
        </div>
        <div className="ds-score-mini">
          <div className="dsm-number" style={{color:levelColor}}>{ghostScore}</div>
          <div className="dsm-label">GHOST SCORE</div>
          <div className="dsm-stamp" style={{color:levelColor,borderColor:levelColor}}>{levelLabel}</div>
        </div>
        <div className="ds-stats">
          <DStat n={supported} label="Supported" color="var(--green)"/>
          <DStat n={distorted} label="Distorted" color="var(--amber)"/>
          <DStat n={hallucinated} label="Hallucinated" color="var(--red)"/>
          <DStat n={missing?.length||0} label="Uncited" color="var(--ink4)"/>
          <DStat n={overclaims} label="Overclaims" color="var(--amber)"/>
        </div>
        <button className="cert-btn" onClick={handleCert} disabled={certLoading}>
          {certLoading?'Generating...':'📜 Download Certificate'}
        </button>
        {isDemo&&<div className="ds-demo-tag">⚡ Demo mode</div>}
      </aside>

      {/* Main content */}
      <main className="dash-main">
        {/* Paper title + summary */}
        <div className="dash-header">
          <div className="dh-eyebrow">FORENSIC REPORT · {new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}).toUpperCase()}</div>
          <h1 className="dh-title">"{paperTitle}"</h1>
          <p className="dh-summary">{summary}</p>
        </div>

        {/* Tabs */}
        <div className="tab-row">
          {TABS.map(t=>(
            <button key={t} className={`tab-btn ${tab===t?'active':''}`} onClick={()=>setTab(t)}>
              {t==='Trust-Me-Bro'?`💪 ${t}`:t==='Missing Citations'?`❓ ${t} (${missing?.length||0})`:t==='Claims'?`👻 ${t} (${total})`:t}
            </button>
          ))}
        </div>

        {/* ── CLAIMS ── */}
        {tab==='Claims'&&(
          <div>
            <div className="filter-row">
              {['ALL','SUPPORTED','DISTORTED','HALLUCINATED'].map(f=>(
                <button key={f} className={`fchip ${filter===f?'active':''} ${f.toLowerCase()}`} onClick={()=>setFilter(f)}>
                  {f==='ALL'?`All ${total}`:f==='SUPPORTED'?`✓ ${supported}`:f==='DISTORTED'?`⚠ ${distorted}`:`👻 ${hallucinated}`}
                </button>
              ))}
            </div>
            <div className="cards-stack">
              {filtered.map((c,i)=><ClaimCard key={c.id} c={c} i={i}/>)}
            </div>
          </div>
        )}

        {/* ── TRUST ME BRO ── */}
        {tab==='Trust-Me-Bro'&&<TrustMeBroTab claims={claims}/>}

        {/* ── MISSING ── */}
        {tab==='Missing Citations'&&(
          <div className="missing-section">
            <p className="section-desc">Claims in this paper that make strong statements without any citation.</p>
            {(missing||[]).length===0&&<div className="empty-ok">✓ No obvious missing citations found</div>}
            {(missing||[]).map((m,i)=>(
              <div key={i} className={`miss-card sev-${m.severity}`} style={{animationDelay:`${i*0.07}s`}}>
                <div className="miss-top">
                  <span className="miss-sev">{m.severity?.toUpperCase()} SEVERITY</span>
                </div>
                <blockquote className="miss-claim">"{m.claim}"</blockquote>
                <p className="miss-reason">⚠ {m.reason}</p>
                <div className="miss-search"><span className="mono-tag">Search:</span><em>{m.suggestedSearch}</em></div>
              </div>
            ))}
          </div>
        )}

        {/* ── REF QUALITY ── */}
        {tab==='Ref Quality'&&<RefQualityTab quality={quality} diversity={diversity} total={total}/>}

        {/* ── NETWORK ── */}
        {tab==='Network'&&<NetworkTab network={network}/>}
      </main>
    </div>
  );
}

/* ── Claim Card ─────────────────────────────────── */
function ClaimCard({c,i}){
  const [open,setOpen]=useState(false);
  const cfg=VC[c.verdict]||VC.SUPPORTED;
  const conf=Math.round((c.confidence||0)*100);
  const bars=Math.round((c.confidence||0)*5);
  return(
    <div className="claim-card" style={{'--cc':cfg.color,'--cb':cfg.bg,animationDelay:`${i*0.06}s`}}>
      <div className="cc-top" onClick={()=>setOpen(!open)}>
        <div className="cc-left">
          <span className="cc-verdict-icon">{cfg.icon}</span>
          <span className="cc-verdict-label" style={{color:cfg.color}}>{cfg.label}</span>
          <span className="cc-conf">{'█'.repeat(bars)}{'░'.repeat(5-bars)} {conf}%</span>
          {c.severity==='high'&&<span className="cc-high">HIGH</span>}
          {c.trustMeBro?.overclaim&&<span className="cc-overclaim">OVERCLAIM</span>}
        </div>
        <div className="cc-meta">
          <span className="cc-type">{c.claimType}</span>
          <span className="cc-toggle">{open?'▲':'▼'}</span>
        </div>
      </div>
      <blockquote className="cc-claim">"{c.claim}"</blockquote>
      <div className="cc-cite">
        <span className="mono-tag">cited:</span>
        <span className="cc-cite-title">{c.citationTitle||c.foundTitle}</span>
        {c.year&&<span className="cc-year">{c.year}</span>}
        {c.citationCount>0&&<span className="cc-cites">{c.citationCount?.toLocaleString()} citations</span>}
        {c.source==='web_search'&&<span className="cc-web-tag">web</span>}
      </div>
      {open&&(
        <div className="cc-detail">
          <div className="cc-row">
            <span className="mono-tag">analysis</span>
            <p>{c.explanation}</p>
          </div>
          {c.exactLine&&(
            <div className="cc-row">
              <span className="mono-tag">exact line from source</span>
              <blockquote className="cc-exact-line">"{c.exactLine}"</blockquote>
            </div>
          )}
          {c.contradiction&&(
            <div className="cc-row red">
              <span className="mono-tag">contradiction</span>
              <p>{c.contradiction}</p>
            </div>
          )}
          {c.trustMeBro?.overclaim&&(
            <div className="cc-row amber">
              <span className="mono-tag">trust-me-bro alert</span>
              <p>{c.trustMeBro.overclaimeExplanation}</p>
              <div className="tmb-bars">
                <div className="tmb-bar-row"><span>Claim Strength</span><ClaimBar val={c.trustMeBro.claimStrength} high/></div>
                <div className="tmb-bar-row"><span>Evidence Strength</span><ClaimBar val={c.trustMeBro.evidenceStrength}/></div>
              </div>
            </div>
          )}
          {c.abstract&&(
            <details className="cc-abstract">
              <summary className="mono-tag">View source abstract ▾</summary>
              <p>{c.abstract}</p>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function ClaimBar({val,high}){
  const map={very_high:4,high:3,medium:2,low:1,strong:4,moderate:3,weak:2,anecdotal:1,none:0};
  const n=map[val]||0;
  const color=high?(n>=3?'var(--red)':'var(--green)'):(n>=3?'var(--green)':'var(--red)');
  return(
    <div className="cbar-wrap">
      {[1,2,3,4].map(i=><div key={i} className="cbar-seg" style={{background:i<=n?color:'rgba(28,20,9,0.12)'}}/>)}
      <span className="cbar-label">{val}</span>
    </div>
  );
}

/* ── Trust Me Bro Tab ───────────────────────────── */
function TrustMeBroTab({claims}){
  const overclaims=claims.filter(c=>c.trustMeBro?.overclaim);
  const fine=claims.filter(c=>c.trustMeBro&&!c.trustMeBro.overclaim);
  return(
    <div className="tmb-tab">
      <p className="section-desc">Detects when a claim is far stronger than its supporting evidence allows.</p>
      {overclaims.length===0&&<div className="empty-ok">✓ No overclaims detected</div>}
      {overclaims.map((c,i)=>(
        <div key={i} className="tmb-card" style={{animationDelay:`${i*0.07}s`}}>
          <div className="tmb-header">
            <span className="tmb-badge">💪 OVERCLAIM DETECTED</span>
            <span className="tmb-cite-ref">{c.citationTitle?.slice(0,50)}</span>
          </div>
          <blockquote className="tmb-claim">"{c.claim}"</blockquote>
          <p className="tmb-expl">{c.trustMeBro?.overclaimeExplanation}</p>
          <div className="tmb-bars">
            <div className="tmb-bar-row"><span>Claim Strength</span><ClaimBar val={c.trustMeBro?.claimStrength} high/></div>
            <div className="tmb-bar-row"><span>Evidence Strength</span><ClaimBar val={c.trustMeBro?.evidenceStrength}/></div>
            <div className="tmb-bar-row"><span>Sample Size</span><ClaimBar val={c.trustMeBro?.sampleSize}/></div>
          </div>
        </div>
      ))}
      {fine.length>0&&(
        <div className="tmb-ok-section">
          <div className="mono-tag">Claims with appropriate evidence strength ({fine.length})</div>
          {fine.map((c,i)=><div key={i} className="tmb-ok-row"><span className="ok-check">✓</span><span className="ok-claim">{c.claim.slice(0,80)}...</span></div>)}
        </div>
      )}
    </div>
  );
}

/* ── Reference Quality Tab ──────────────────────── */
function RefQualityTab({quality,diversity,total}){
  if(!quality)return<div className="empty-ok">Quality data not available</div>;
  const gradeColor={A:'var(--green)',B:'var(--green)',C:'var(--amber)',D:'var(--red)',F:'var(--red)'}[quality.overallGrade]||'var(--ink3)';
  return(
    <div className="qual-tab">
      <p className="section-desc">Analysis of citation quality and source diversity across all references.</p>
      <div className="qual-grid">
        {/* Grade card */}
        <div className="qual-card grade-card">
          <div className="qc-label">Reference Grade</div>
          <div className="qc-grade" style={{color:gradeColor}}>{quality.overallGrade}</div>
          <div className="qc-note">{quality.topVenues?.join(' · ')}</div>
        </div>
        {/* Diversity card */}
        {diversity&&(
          <div className="qual-card">
            <div className="qc-label">Source Diversity</div>
            <div className="qc-grade" style={{color:diversity.diversityScore>=70?'var(--green)':diversity.diversityScore>=50?'var(--amber)':'var(--red)'}}>{diversity.diversityScore}<span className="qc-unit">/100</span></div>
            <div className="qc-note">{diversity.echoChambered?'⚠ Echo chamber risk':'✓ Diverse sources'}</div>
          </div>
        )}
      </div>
      {/* Breakdown bars */}
      <div className="qual-breakdown">
        <div className="qb-title">Citation Type Breakdown</div>
        {[
          {label:'Peer Reviewed',val:quality.peerReviewed,color:'var(--green)'},
          {label:'Preprint',val:quality.preprint,color:'var(--amber)'},
          {label:'Low Quality Conf.',val:quality.lowQualityConf,color:'var(--red)'},
          {label:'Blog / Web',val:quality.blog,color:'var(--red)'},
        ].map((b,i)=>(
          <div key={i} className="qb-row">
            <span className="qb-label">{b.label}</span>
            <div className="qb-bar-wrap">
              <div className="qb-bar" style={{width:`${b.val}%`,background:b.color}}/>
            </div>
            <span className="qb-pct">{b.val}%</span>
          </div>
        ))}
      </div>
      {quality.concerns?.length>0&&(
        <div className="qual-concerns">
          {quality.concerns.map((c,i)=><div key={i} className="qc-concern">⚠ {c}</div>)}
        </div>
      )}
      {diversity?.concerns?.length>0&&(
        <div className="qual-concerns">
          {diversity.concerns.map((c,i)=><div key={i} className="qc-concern">⚠ {c}</div>)}
        </div>
      )}
    </div>
  );
}

/* ── Network Tab ────────────────────────────────── */
function NetworkTab({network}){
  const nodes=network?.nodes||[];
  const edges=network?.edges||[];
  const clusters=network?.clusters||[];
  if(!nodes.length)return<div className="empty-ok">Network data not available</div>;
  const W=600,H=320,cx=W/2,cy=H/2,r=120;
  const pos=nodes.map((n,i)=>{
    if(n.role==='self')return{x:cx,y:cy};
    const a=(i/(nodes.length-1))*Math.PI*2;
    return{x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)};
  });
  return(
    <div className="net-tab">
      <p className="section-desc">Co-author citation connections extracted from this paper's reference list.</p>
      <div className="net-svg-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="net-svg">
          {edges.map((e,i)=>{
            const fi=nodes.findIndex(n=>n.id===e.from);
            const ti=nodes.findIndex(n=>n.id===e.to);
            if(fi<0||ti<0)return null;
            return<line key={i} x1={pos[fi].x} y1={pos[fi].y} x2={pos[ti].x} y2={pos[ti].y} stroke="rgba(28,20,9,0.18)" strokeWidth="1.5" strokeDasharray="5,3"/>;
          })}
          {nodes.map((n,i)=>(
            <g key={i} transform={`translate(${pos[i].x},${pos[i].y})`}>
              <circle r={n.role==='self'?20:13} fill={n.role==='self'?'var(--red)':'var(--paper2)'} stroke={n.role==='self'?'var(--red)':'rgba(28,20,9,0.2)'} strokeWidth="1.5"/>
              <text y={n.role==='self'?32:24} textAnchor="middle" fontSize="9" fill="var(--ink2)" fontFamily="'Martian Mono',monospace">{n.id}</text>
            </g>
          ))}
        </svg>
      </div>
      {clusters.length>0&&(
        <div className="net-clusters">
          <div className="mono-tag" style={{marginBottom:'0.6rem'}}>Research Clusters</div>
          <div className="cluster-row">
            {clusters.map((cl,i)=>(
              <div key={i} className="cluster-box">
                <div className="cb-name">{cl.name}</div>
                <div className="cb-members">{cl.members.map(m=><span key={m} className="cb-member">{m}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="net-edges">
        <div className="mono-tag" style={{marginBottom:'0.5rem'}}>Connections</div>
        {edges.map((e,i)=>(
          <div key={i} className="edge-row">
            <span className="edge-from">{e.from}</span>
            <span className="edge-arr">→</span>
            <span className="edge-to">{e.to}</span>
            <span className="edge-paper">{e.sharedPaper}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DStat({n,label,color}){
  return(
    <div className="ds-stat">
      <span style={{fontFamily:'var(--f-display)',fontSize:'1.6rem',fontWeight:700,color,lineHeight:1}}>{n}</span>
      <span style={{fontFamily:'var(--f-mono)',fontSize:'0.58rem',color:'rgba(244,239,228,0.3)',textTransform:'uppercase',letterSpacing:'0.08em'}}>{label}</span>
    </div>
  );
}
