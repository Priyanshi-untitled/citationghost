import React,{useEffect,useState} from 'react';
import './TearEffect.css';
export default function TearEffect({fileName}){
  const [go,setGo]=useState(false);
  const [ghost,setGhost]=useState(false);
  useEffect(()=>{const t1=setTimeout(()=>setGo(true),200);const t2=setTimeout(()=>setGhost(true),900);return()=>{clearTimeout(t1);clearTimeout(t2)}},[]);
  const lines=n=>Array.from({length:n},(_,i)=><div key={i} className="tear-line" style={{width:`${50+Math.random()*45}%`,opacity:0.2+Math.random()*0.4}}/>);
  return(
    <div className="tear-wrap">
      <div className={`tear-top ${go?'go':''}`}>
        <div className="tear-content-top">
          <div className="tear-brand">CitationGhost Forensics · Analyzing</div>
          <div className="tear-filename">"{fileName}"</div>
          <div className="tear-lines">{lines(7)}</div>
        </div>
        <div className="tear-edge-top"/>
      </div>
      <div className={`ghost-center ${ghost?'show':''}`}>
        <span className="gc-ghost">👻</span>
        <p className="gc-text">Examining citations...</p>
      </div>
      <div className={`tear-bot ${go?'go':''}`}>
        <div className="tear-edge-bot"/>
        <div className="tear-content-bot">
          <div className="tear-lines">{lines(9)}</div>
        </div>
      </div>
    </div>
  );
}
