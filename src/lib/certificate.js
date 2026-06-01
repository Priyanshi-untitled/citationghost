export async function downloadCertificate(results) {
  const {ghostScore,hallucinated,distorted,supported,total,paperTitle,summary}=results;
  const level=ghostScore<=20?'VERIFIED CLEAN':ghostScore<=50?'QUESTIONABLE':'COMPROMISED';
  const color=ghostScore<=20?'#1a6b3a':ghostScore<=50?'#c46b0a':'#b5271e';
  const date=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const canvas=document.createElement('canvas');
  canvas.width=900;canvas.height=600;
  const ctx=canvas.getContext('2d');
  // Background
  const g=ctx.createLinearGradient(0,0,900,600);
  g.addColorStop(0,'#f4efe4');g.addColorStop(1,'#e0d5b8');
  ctx.fillStyle=g;ctx.fillRect(0,0,900,600);
  // Top bar
  const bar=ctx.createLinearGradient(0,0,900,0);
  bar.addColorStop(0,'#b5271e');bar.addColorStop(1,'#c46b0a');
  ctx.fillStyle=bar;ctx.fillRect(0,0,900,5);
  // Border
  ctx.strokeStyle='rgba(28,20,9,0.15)';ctx.lineWidth=1;
  ctx.strokeRect(24,24,852,552);
  ctx.strokeRect(30,30,840,540);
  // Header
  ctx.fillStyle='#1c1409';ctx.textAlign='center';
  ctx.font='bold 11px "Courier New"';ctx.fillText('CITATIONGHOST FORENSIC CITATION LABORATORY',450,62);
  ctx.font='10px "Courier New"';ctx.fillStyle='#7a6a4a';
  ctx.fillText('CITATION INTEGRITY CERTIFICATE · '+date.toUpperCase(),450,80);
  ctx.strokeStyle='rgba(28,20,9,0.12)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(60,94);ctx.lineTo(840,94);ctx.stroke();
  // Ghost
  ctx.font='56px serif';ctx.fillText('👻',450,164);
  // Paper title
  ctx.font='italic bold 18px Georgia';ctx.fillStyle='#1c1409';
  ctx.fillText('"'+(paperTitle||'Research Paper').slice(0,60)+'"',450,205);
  // Score
  ctx.font='bold 72px Georgia';ctx.fillStyle=color;ctx.fillText(ghostScore.toString(),450,290);
  ctx.font='11px "Courier New"';ctx.fillStyle='#7a6a4a';
  ctx.fillText('GHOST SCORE  ·  0 = CLEAN  ·  100 = SEVERELY COMPROMISED',450,312);
  // Stamp
  ctx.save();ctx.translate(450,365);ctx.rotate(-0.05);
  ctx.font='bold 26px "Courier New"';
  ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.strokeText(level,0,0);
  ctx.fillStyle=color+'28';ctx.fillText(level,0,0);ctx.restore();
  // Stats
  [{n:supported,l:'SUPPORTED',c:'#1a6b3a'},{n:distorted,l:'DISTORTED',c:'#c46b0a'},{n:hallucinated,l:'HALLUCINATED',c:'#b5271e'},{n:total,l:'TOTAL',c:'#1c1409'}].forEach((s,i)=>{
    const x=150+i*155;
    ctx.font='bold 24px Georgia';ctx.fillStyle=s.c;ctx.textAlign='center';ctx.fillText(s.n.toString(),x,428);
    ctx.font='9px "Courier New"';ctx.fillStyle='#7a6a4a';ctx.fillText(s.l,x,442);
  });
  // Summary
  ctx.font='13px Georgia';ctx.fillStyle='#3d3120';ctx.textAlign='center';
  const words=summary.split(' ');let line='',y=478;
  words.forEach(w=>{const t=line+w+' ';if(ctx.measureText(t).width>720&&line){ctx.fillText(line.trim(),450,y);y+=18;line=w+' ';}else{line=t;}});
  if(line)ctx.fillText(line.trim(),450,y);
  // Footer
  ctx.font='9px "Courier New"';ctx.fillStyle='#a89878';ctx.fillText('Powered by CitationGhost · Claude AI · Semantic Scholar',450,566);
  // Download
  const a=document.createElement('a');
  a.download=`citationghost-${(paperTitle||'paper').slice(0,25).replace(/\s/g,'-')}.png`;
  a.href=canvas.toDataURL('image/png');a.click();
}
