// src/lib/sources.js
const SS = 'https://api.semanticscholar.org/graph/v1';

async function ssSearch(title) {
  try {
    const q = encodeURIComponent(title.slice(0, 100));
    const r = await fetch(`${SS}/paper/search?query=${q}&fields=title,abstract,year,authors,citationCount&limit=1`);
    if (!r.ok) return null;
    const d = await r.json();
    return d.data?.[0] || null;
  } catch { return null; }
}

// Web search fallback via Claude with web_search tool
async function webSearchFallback(title) {
  const key = window.__CG_KEY__;
  if (!key) return null;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{
          role: 'user',
          content: `Find the abstract of this research paper: "${title}". Return ONLY the abstract text, nothing else.`
        }]
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.content.map(b => b.text || '').join('').trim();
    return text.length > 50 ? { abstract: text, source: 'web' } : null;
  } catch { return null; }
}

export async function fetchAbstracts(claims, onProgress) {
  const results = [];
  for (let i = 0; i < claims.length; i++) {
    const c = claims[i];
    onProgress?.(`Fetching source ${i + 1}/${claims.length}: "${c.citationTitle?.slice(0, 45)}..."`);
    
    // Try Semantic Scholar first
    let paper = await ssSearch(c.citationTitle || '');
    let abstract = paper?.abstract || null;
    let source = 'semantic_scholar';
    let citationCount = paper?.citationCount || 0;
    let year = paper?.year || null;
    let foundTitle = paper?.title || null;

    // Fallback to web search if not found
    if (!abstract) {
      onProgress?.(`  ↳ Not in Semantic Scholar, trying web search...`);
      const web = await webSearchFallback(c.citationTitle || '');
      if (web) { abstract = web.abstract; source = 'web_search'; }
    }

    results.push({ ...c, abstract, source, citationCount, year, foundTitle });
    await delay(1100);
  }
  return results;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
