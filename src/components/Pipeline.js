import React,{useEffect,useRef} from 'react';
import './Pipeline.css';
const STAGES=[
  {icon:'📄',label:'Read PDF',t:1},{icon:'🔍',label:'Extract Claims',t:3},
  {icon:'📚',label:'Fetch Abstracts',t:5},{icon:'🔬',label:'Verify Claims',t:8},
  {icon:'💪',label:'Trust-Me-Bro',t:10},{icon:'❓',label:'Missing Citations',t:11},
  {icon:'📊',label:'Ref Quality',t:12},{icon:'🕸',label:'Network',t:13},{icon:'👻',label:'Ghost Score',t:14},
];
function activeStage(n){for(let i=STAGES.length-1;i>=0;i--){if(n>STAGES[i].t)return i+1;}return 0;}
function fmt(ts){const d=new Date(ts);return`${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;}
export default function Pipeline({logs,fileName}){
  const ref=useRef();
  useEffect(()=>ref.current?.scrollIntoView({behavior:'smooth'}),[logs]);
  const active=activeStage(logs.length);
  return(
    <div className="pipe-wrap">
      <aside className="pipe-side">
        <div className="ps-brand"><span style={{fontSize:'1.6rem',animation:'float 3s ease-in-out infinite',display:'inline-block'}}>👻</span><span className="ps-name">CitationGhost</span></div>
        <div className="ps-stages">
          {STAGES.map((s,i)=>{const st=i<active?'done':i===active?'active':'pending';return(
            <div key={i} className={`ps-stage ${st}`}>
              <span className="ps-dot">{st==='done'?'✓':st==='active'?'◉':'○'}</span>
              <span className="ps-icon">{s.icon}</span>
              <span className="ps-label">{s.label}</span>
            </div>
          );})}
        </div>
        <div className="ps-file">Analyzing:<br/><em>{fileName}</em></div>
      </aside>
      <main className="pipe-main">
        <div className="term-window">
          <div className="term-titlebar">
            <span className="tdot r"/><span className="tdot a"/><span className="tdot g"/>
            <span className="term-title-text">citationghost — forensic analysis</span>
          </div>
          <div className="term-body">
            <div className="term-prompt">$ citationghost analyze --full --verbose<span className="tcursor">█</span></div>
            {logs.map((e,i)=>(
              <div key={e.ts+i} className={`tline ${e.type}`} style={{animationDelay:`${i*0.03}s`}}>
                <span className="tts">[{fmt(e.ts)}]</span>
                <span className="tmsg">{e.msg}</span>
              </div>
            ))}
            {logs.length===0&&<div className="tline info"><span className="tts">[00:00]</span><span className="tmsg">Initializing pipeline...</span></div>}
            <div ref={ref}/>
          </div>
        </div>
        <p className="pipe-note">Real papers: 3–5 min · Semantic Scholar rate limit: 1 req/sec</p>
      </main>
    </div>
  );
}
