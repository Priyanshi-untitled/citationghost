# 👻 CitationGhost
### AI-Powered Citation Forensics for Research Papers

> *"Don't just check if text was copied — check if claims are actually true."*

---

## What is CitationGhost?

CitationGhost is the world's first **claim-level citation verification tool** for research papers. Upload any PDF and it automatically:

1. Extracts every factual claim that cites another paper
2. Fetches the original source abstracts (Semantic Scholar + web search)
3. Verifies whether what the author wrote actually matches what the cited paper says
4. Runs a full forensic integrity analysis

**No existing tool does this.** Plagiarism checkers verify copied text. CitationGhost verifies whether *claims are true*.

---

## Features

| Feature | Description |
|---|---|
| 👻 **Hallucination Detection** | Source says nothing of the sort |
| ⚠️ **Distortion Detection** | Claim exaggerates or misrepresents source |
| 🔍 **Exact Evidence Line** | Pinpoints the exact phrase that supports or contradicts |
| 💪 **Trust-Me-Bro Detector** | Strong claim backed by weak/small evidence |
| ❓ **Missing Citations** | Finds strong claims with zero references |
| 📊 **Reference Quality** | Peer-reviewed vs preprint vs blog breakdown |
| 🌐 **Source Diversity** | Detects echo chambers in citation patterns |
| 🕸️ **Citation Network** | Co-author connections visualized |
| 📜 **Integrity Certificate** | Downloadable shareable proof of analysis |

---

## Ghost Score

Every paper gets a **Ghost Score from 0–100:**

- **0–20** → ✅ Verified Clean
- **21–50** → ⚠️ Questionable  
- **51–100** → 🚨 Compromised

---

## Tech Stack

- **Frontend** — React 18, custom parchment/ink UI
- **AI** — Claude Sonnet (claim extraction + verification)
- **Sources** — Semantic Scholar API (free, no key needed) + web search fallback
- **PDF** — pdf.js (browser-side extraction)
- **Backend** — Express.js (API key stays server-side, never exposed)
- **Deploy** — Render / Vercel

---

## Local Setup

```bash
# 1. Clone repo
git clone https://github.com/YOUR_USERNAME/citationghost.git
cd citationghost

# 2. Install dependencies
npm install

# 3. Build React app
npm run build

# 4. Set your API key
export ANTHROPIC_API_KEY=sk-ant-api03-...

# 5. Start server
npm start
```

Open `http://localhost:3000`

---

## Deploy on Render

1. Push code to GitHub
2. New Web Service on render.com → connect repo
3. **Build Command:** `npm run build`
4. **Start Command:** `npm start`
5. **Environment Variable:** `ANTHROPIC_API_KEY` = your key
6. Deploy → share the link!

Users never see or need an API key.

---

## Cost

| Action | Cost |
|---|---|
| One paper analysis (~10 claims) | ~$0.02 |
| $5 credit | ~250 papers |
| Demo mode | Free (no API calls) |

---

## Demo

Click **"⚡ Run demo analysis"** on the homepage — no API key needed. Pre-loaded with *"Attention Is All You Need"* (Vaswani et al. 2017) showing real hallucination detection results.

**The jaw-drop moment:** Claim #5 — a specific vocabulary size number attributed to Sennrich et al. that never appears in their paper.

---

## Why This Matters

- One hallucinated citation in a **medical paper** → wrong treatment protocols
- One distorted citation in a **legal brief** → wrong precedent cited  
- One overclaim in a **policy paper** → bad legislation

CitationGhost makes citation integrity verifiable, automatic, and shareable.

---

*Built for hackathon · Powered by Claude AI · Semantic Scholar*
