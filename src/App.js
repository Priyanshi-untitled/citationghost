import React, { useState, useCallback } from 'react';
import Landing from './components/Landing';
import TearEffect from './components/TearEffect';
import Pipeline from './components/Pipeline';
import Dashboard from './components/Dashboard';

export default function App() {
  const [stage, setStage] = useState('landing');
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);
  const [fileName, setFileName] = useState('');

  const log = (msg, type='info') => setLogs(p => [...p, { msg, type, ts: Date.now() }]);

  const handleStart = useCallback(async (file, isDemo) => {
    setFileName(file?.name?.replace('.pdf','') || 'Attention Is All You Need');
    setStage('tearing');
    setTimeout(() => { setStage('pipeline'); doRun(file, isDemo); }, 2400);
  }, []);

  const doRun = async (file, isDemo) => {
    setLogs([]);
    try {
      if (isDemo) await runDemo(log, setResults);
      else await runReal(file, log, setResults);
      setStage('done');
    } catch(e) { log(`Error: ${e.message}`, 'error'); }
  };

  return (
    <div>
      {stage==='landing' && <Landing onStart={handleStart} />}
      {stage==='tearing' && <TearEffect fileName={fileName} />}
      {stage==='pipeline' && <Pipeline logs={logs} fileName={fileName} />}
      {stage==='done' && results && <Dashboard results={results} onReset={()=>{setStage('landing');setResults(null);setLogs([]);}} />}
    </div>
  );
}

async function runDemo(log, setResults) {
  const { DEMO_CLAIMS, DEMO_MISSING, DEMO_NETWORK, DEMO_PAPER, DEMO_QUALITY, DEMO_DIVERSITY } = await import('./lib/demoData');
  log('Paper loaded: "Attention Is All You Need" (15 pages)', 'info'); await s(500);
  log(`Extracted ${DEMO_CLAIMS.length} cited claims via Claude`, 'success'); await s(400);
  log('Fetching source abstracts — Semantic Scholar API...', 'info');
  for (let i=0; i<DEMO_CLAIMS.length; i++) {
    await s(550);
    log(`[${i+1}/${DEMO_CLAIMS.length}] "${DEMO_CLAIMS[i].citationTitle?.slice(0,48)}" — ${DEMO_CLAIMS[i].year} · ${DEMO_CLAIMS[i].citationCount?.toLocaleString()} cites`, 'info');
  }
  await s(400);
  log('Verifying claims against source abstracts...', 'info');
  for (let i=0; i<DEMO_CLAIMS.length; i++) {
    await s(650);
    const c = DEMO_CLAIMS[i];
    const sym = c.verdict==='SUPPORTED'?'✓':c.verdict==='DISTORTED'?'~':'✗';
    log(`[${sym}] ${c.verdict} · "${c.claim.slice(0,52)}..."`, c.verdict.toLowerCase());
  }
  await s(500);
  log('Running Trust-Me-Bro detector...', 'info'); await s(700);
  log('2 overclaims detected — evidence too weak for claim strength', 'warn'); await s(400);
  log('Scanning for missing citations...', 'info'); await s(600);
  log(`Found ${DEMO_MISSING.length} uncited factual claims`, 'warn'); await s(400);
  log('Analyzing reference quality & source diversity...', 'info'); await s(700);
  log('Reference grade: A — 85% peer-reviewed, top venues (NeurIPS, ACL)', 'success'); await s(400);
  log('Building co-author citation network...', 'info'); await s(600);
  log(`Network: ${DEMO_NETWORK.nodes.length} authors · ${DEMO_NETWORK.edges.length} connections`, 'success'); await s(400);
  const h=DEMO_CLAIMS.filter(c=>c.verdict==='HALLUCINATED').length;
  const d=DEMO_CLAIMS.filter(c=>c.verdict==='DISTORTED').length;
  const sup=DEMO_CLAIMS.filter(c=>c.verdict==='SUPPORTED').length;
  const ghostScore=Math.round(((h+d*0.5)/DEMO_CLAIMS.length)*100);
  log(`Ghost Score: ${ghostScore}/100 — analysis complete`, ghostScore>30?'error':'success');
  setResults({
    claims:DEMO_CLAIMS, missing:DEMO_MISSING, network:DEMO_NETWORK,
    quality:DEMO_QUALITY, diversity:DEMO_DIVERSITY,
    ghostScore, hallucinated:h, distorted:d, supported:sup, total:DEMO_CLAIMS.length,
    summary:`This paper shows moderate citation integrity issues. One quantitative claim (BPE vocabulary size) is outright hallucinated — the attributed number appears nowhere in the cited paper. Two claims are distorted, including a misattributed parallelization critique. The reference list itself is high quality but two claims attribute implementation decisions to papers that never made them.`,
    paperTitle:DEMO_PAPER.title, isDemo:true,
  });
}

async function runReal(file, log, setResults) {
  const { extractText } = await import('./lib/pdfExtractor');
  const { extractClaims, verifyClaim, detectTrustMeBro, findMissingCitations, analyzeReferenceQuality, checkSourceDiversity, buildCitationNetwork, finalSummary } = await import('./lib/claudeApi');
  const { fetchAbstracts } = await import('./lib/sources');

  log(`Reading "${file.name}"...`,'info');
  const { text, pages } = await extractText(file);
  log(`Extracted text — ${pages} pages`,'success');

  log('Extracting cited claims with Claude...','info');
  const rawClaims = await extractClaims(text);
  if (!rawClaims.length) throw new Error('No cited claims found.');
  log(`Found ${rawClaims.length} cited claims`,'success');

  log('Fetching source abstracts...','info');
  const withAbs = await fetchAbstracts(rawClaims, msg=>log(msg,'info'));
  log(`Sourced ${withAbs.filter(c=>c.abstract).length}/${rawClaims.length} abstracts`,'success');

  const verified = [];
  for (let i=0; i<withAbs.length; i++) {
    const c = withAbs[i];
    log(`Verifying ${i+1}/${withAbs.length}...`,'info');
    const v = await verifyClaim(c.claim, c.citationTitle, c.abstract);
    const tmb = await detectTrustMeBro(c.claim, c.abstract, c.citationTitle);
    const sym = v.verdict==='SUPPORTED'?'✓':v.verdict==='DISTORTED'?'~':'✗';
    log(`[${sym}] ${v.verdict} (${Math.round(v.confidence*100)}%)`,v.verdict.toLowerCase());
    verified.push({...c,...v,id:i,trustMeBro:tmb});
    await s(200);
  }

  log('Running Trust-Me-Bro detector...','info');
  const overclaims = verified.filter(c=>c.trustMeBro?.overclaim).length;
  log(`${overclaims} potential overclaims detected`, overclaims>0?'warn':'success');

  log('Scanning for missing citations...','info');
  const missing = await findMissingCitations(text);
  log(`${missing.length} uncited claims found`, missing.length>0?'warn':'success');

  log('Analyzing reference quality...','info');
  const quality = await analyzeReferenceQuality(verified);
  log(`Reference grade: ${quality?.overallGrade||'?'}`,'success');

  log('Checking source diversity...','info');
  const diversity = await checkSourceDiversity(verified);
  log(`Diversity score: ${diversity?.diversityScore||'?'}/100`,'success');

  log('Building citation network...','info');
  const network = await buildCitationNetwork(text, file.name);
  log(`Network: ${network?.nodes?.length} authors`,'success');

  const score = await finalSummary(verified, missing);
  log(`Ghost Score: ${score.ghostScore}/100`, score.ghostScore>40?'error':'success');

  setResults({ claims:verified, missing, network, quality, diversity, ...score, paperTitle:file.name.replace('.pdf',''), isDemo:false });
}

function s(ms){return new Promise(r=>setTimeout(r,ms));}
