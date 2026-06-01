// api/analyze.js
// Vercel serverless function — API key yahan chhupa hai, user ko nahi dikhta

export default async function handler(req, res) {
  // CORS — browser se call allow karo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, user, useWebSearch } = req.body;

  if (!system || !user) {
    return res.status(400).json({ error: 'Missing system or user message' });
  }

  // Key yahan Vercel ke environment variable se aati hai
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const body = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system,
      messages: [{ role: 'user', content: user }],
    };

    if (useWebSearch) {
      body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const text = data.content.map(b => b.text || '').join('');
    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
