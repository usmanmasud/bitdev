# ⚡ BitOracle — Decentralized AI Reputation Scoring for Bitcoin MSMEs

> Built for **BitDevs BUK Hackathon 2026** · BOI-BUK Innovation Hub

## What It Does

BitOracle is a **trust primitive** — not just an app. It ingests public Bitcoin on-chain history for any wallet address and produces a verifiable, explainable reputation score that MSMEs can use to unlock decentralized lending and B2B partnerships — no KYC, no bank, no intermediary.

---

## Unique Features (What Others Won't Build)

| Feature | What it does |
|---|---|
| **Explainable AI Score** | 7-factor breakdown — not a black box |
| **On-chain Commitment** | HMAC-SHA256 hash anchored via simulated OP_RETURN |
| **Score Verification API** | Any third party can verify a score without trusting us |
| **Merchant Graph Analysis** | Detects B2B diversity from counterparty addresses |
| **Lightning Activity Inference** | Infers LN behavior from small/frequent outputs |
| **Temporal Decay Penalty** | Punishes dormant wallets — rewards active ones |
| **Oracle API** | `GET /api/reputation/:address` — plug into any lending app |

---

## Scoring Model

| Dimension | Max Points |
|---|---|
| Wallet Age & Longevity | 20 |
| Transaction Frequency | 20 |
| UTXO Health | 15 |
| Payment Consistency | 15 |
| Merchant Graph Diversity | 15 |
| Lightning Activity Bonus | 10 |
| Temporal Decay Penalty | -5 to 0 |

**Total: 0–100**

---

## API Reference

```
GET /api/reputation/:address
GET /api/reputation/:address/verify?score=&riskBand=&timestamp=&hash=
GET /api/reputation/:address/commitment
GET /api/health
```

### Example Response
```json
{
  "address": "bc1q...",
  "score": 72.4,
  "riskBand": "LOW_RISK",
  "lendingRecommendation": "Eligible for unsecured micro-lending up to 0.05 BTC",
  "factors": {
    "walletAge": { "score": 18.2, "max": 20, "detail": "Wallet active for ~332 days" },
    "txFrequency": { "score": 14.0, "max": 20, "detail": "35 transactions found" },
    ...
  },
  "commitment": {
    "hash": "a3f7c...",
    "opReturnHex": "424954...",
    "timestamp": "2026-06-13T10:00:00.000Z"
  }
}
```

---

## Running Locally

### Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Architecture

```
Bitcoin Network (mempool.space API)
        ↓
  [ Data Ingestion ]  ← bitcoin.js
        ↓
  [ Scoring Engine ]  ← scorer.js (7-factor AI model)
        ↓
  [ Oracle Layer ]    ← oracle.js (HMAC commitment + OP_RETURN)
        ↓
  [ REST API ]        ← Express routes
        ↓
  [ React Dashboard ] ← Radar chart, gauge, commitment card
```

---

## Tech Stack

- **Backend:** Node.js · Express · mempool.space API
- **Frontend:** React · Vite · Tailwind CSS · Recharts
- **Crypto:** Node built-in `crypto` (HMAC-SHA256)
- **Data:** mempool.space public API (no API key needed)
