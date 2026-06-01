// src/lib/claudeApi.js
// Ab seedha Anthropic nahi — apne backend ko call karta hai
// Key user ko nahi dikhti

async function claude(system, user) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, user }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}

function parseJSON(raw) {
  try { return JSON.parse(raw.replace(/```json|```/g, '').trim()); }
  catch { return null; }
}

export async function extractClaims(text) {
  const raw = await claude(
    `Extract cited factual claims from a research paper. Return ONLY a JSON array:
[{"claim":"exact sentence","citationTitle":"cited paper title","claimType":"quantitative|comparative|methodological|factual","pageHint":"intro|methods|results|discussion","claimStrength":"high|medium|low"}]
Extract 6-10 most verifiable claims. Prefer quantitative ones.`,
    `Extract claims:\n\n${text.slice(0, 9000)}`
  );
  return parseJSON(raw) || [];
}

export async function verifyClaim(claim, citationTitle, abstract) {
  if (!abstract) return { verdict: 'HALLUCINATED', confidence: 0.5, explanation: 'Source not found in any database.', exactLine: null, contradiction: null, severity: 'medium' };
  const raw = await claude(
    `You are a citation forensics expert. Return ONLY JSON:
{"verdict":"SUPPORTED"|"DISTORTED"|"HALLUCINATED","confidence":0.0-1.0,"explanation":"2 sentence forensic analysis","exactLine":"exact phrase from abstract that most supports or contradicts this","contradiction":"if distorted/hallucinated: what source actually says vs claim","severity":"low"|"medium"|"high","evidenceStrength":"strong|moderate|weak|none"}`,
    `CLAIM: "${claim}"\nCITED: "${citationTitle}"\nABSTRACT: "${abstract}"\nVerify.`
  );
  return parseJSON(raw) || { verdict: 'HALLUCINATED', confidence: 0.4, explanation: 'Parse error.', exactLine: null, severity: 'medium' };
}

export async function detectTrustMeBro(claim, abstract, citationTitle) {
  const raw = await claude(
    `Analyze claim strength vs evidence strength. Return ONLY JSON:
{"claimStrength":"very_high"|"high"|"medium"|"low","evidenceStrength":"strong"|"moderate"|"weak"|"anecdotal","sampleSize":"large"|"medium"|"small"|"unclear","overclaim":true|false,"overclaimeExplanation":"why this is an overclaim or null"}`,
    `CLAIM: "${claim}"\nEVIDENCE: "${abstract || 'Not found'}"\nCITED: "${citationTitle}"`
  );
  return parseJSON(raw) || null;
}

export async function findMissingCitations(text) {
  const raw = await claude(
    `Find strong factual claims with no citation. Return ONLY JSON array:
[{"claim":"uncited claim sentence","reason":"why it needs citation","suggestedSearch":"what to search for","severity":"low"|"medium"|"high"}]
Find 3-5 most concerning.`,
    `Analyze:\n\n${text.slice(0, 7000)}`
  );
  return parseJSON(raw) || [];
}

export async function analyzeReferenceQuality(citations) {
  const raw = await claude(
    `Analyze citation quality. Return ONLY JSON:
{"peerReviewed":0-100,"preprint":0-100,"blog":0-100,"lowQualityConf":0-100,"unknown":0-100,"topVenues":["venue1"],"concerns":["concern1"],"overallGrade":"A"|"B"|"C"|"D"|"F"}`,
    `Citations:\n${citations.map(c => c.citationTitle || '').join('\n').slice(0, 3000)}`
  );
  return parseJSON(raw) || null;
}

export async function checkSourceDiversity(claims) {
  const raw = await claude(
    `Analyze source diversity. Return ONLY JSON:
{"diversityScore":0-100,"dominantGroup":"group name or null","echoChambered":true|false,"uniqueGroups":5,"totalCitations":10,"concerns":["concern"],"breakdown":{"sameGroup":30,"diverse":70}}`,
    `Citations:\n${claims.map(c => c.citationTitle).join('\n').slice(0, 2000)}`
  );
  return parseJSON(raw) || null;
}

export async function buildCitationNetwork(text, paperTitle) {
  const raw = await claude(
    `Extract cited authors and build citation network. Return ONLY JSON:
{"nodes":[{"id":"Author","papers":1,"role":"cited"|"self"}],"edges":[{"from":"A","to":"B","sharedPaper":"title"}],"clusters":[{"name":"label","members":["A"]}]}
Max 12 nodes, first authors only.`,
    `Paper: "${paperTitle}"\n\n${text.slice(0, 5000)}`
  );
  return parseJSON(raw) || { nodes: [], edges: [], clusters: [] };
}

export async function finalSummary(claims, missing) {
  const h = claims.filter(c => c.verdict === 'HALLUCINATED').length;
  const d = claims.filter(c => c.verdict === 'DISTORTED').length;
  const s = claims.filter(c => c.verdict === 'SUPPORTED').length;
  const ghostScore = Math.round(((h * 1.0 + d * 0.5) / claims.length) * 100);
  const summary = await claude(
    `You are CitationGhost forensics AI. Write 2-3 sentence clinical verdict. No flattery. Be precise.`,
    `${s} supported, ${d} distorted, ${h} hallucinated. ${missing.length} uncited claims. Ghost Score: ${ghostScore}/100.`
  );
  return { ghostScore, hallucinated: h, distorted: d, supported: s, total: claims.length, summary };
}
