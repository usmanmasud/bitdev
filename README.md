<div align="center">

# ⚡ BitOracle

### Decentralized AI Reputation Scoring for Bitcoin MSMEs

[![Built for BitDevs BUK Hackathon 2026](https://img.shields.io/badge/BitDevs%20BUK-Hackathon%202026-orange?style=flat-square)](https://github.com)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**BOI-BUK Innovation Hub · Kano, Nigeria · June 13, 2026**

[Live Demo](#running-locally) · [API Reference](#api-reference) · [Architecture](#architecture)

</div>

---

## The Problem

**1.7 billion adults** globally are unbanked. In Nigeria alone, over **90% of informal MSMEs** operate without access to credit — not because they aren't creditworthy, but because traditional finance has never looked at the right data.

Bitcoin's public ledger contains everything needed to build a trust score: transaction history, UTXO age, payment patterns, counterparty diversity, and Lightning Network activity. BitOracle is the engine that reads it.

> *"We don't need banks to tell us who to trust. The chain already knows."*

---

## What is BitOracle?

BitOracle is a **trust primitive** — not just an app. It ingests public Bitcoin on-chain history for any wallet address and produces a verifiable, explainable reputation score (0–100) that MSMEs can use to unlock decentralized lending and B2B partnerships — no KYC, no bank, no intermediary.

---

## Features

| Feature | Description |
|---|---|
| 🧠 **Explainable AI Score** | 7-factor breakdown — not a black box. Every point is justified with on-chain evidence |
| 🔗 **On-chain Commitment** | HMAC-SHA256 hash anchored via simulated OP_RETURN — tamper-proof & verifiable |
| ✅ **Score Verification API** | Any third party can verify a score without trusting BitOracle |
| 🏪 **Merchant Graph Analysis** | Detects B2B payment diversity from counterparty addresses |
| ⚡ **Lightning Activity Inference** | Infers LN behavior from small, frequent outputs |
| 📉 **Temporal Decay Penalty** | Dormant wallets are penalized — active wallets are rewarded |
| 🪪 **Lending Passport PDF** | Downloadable credential with QR code for offline verification |
| 🔌 **Oracle API** | `GET /api/reputation/:address` — plug into any lending app or marketplace |

---

## Scoring Model

Scores range from **0 to 100** across 7 dimensions, directly addressing the hackathon brief:

| Dimension | Signal Used | Max Points |
|---|---|---|
| Wallet Age & Longevity | Oldest transaction timestamp | 20 |
| Transaction Frequency | Total transaction count | 20 |
| UTXO Health | UTXO count + total satoshis | 15 |
| Payment Consistency | Standard deviation of tx intervals | 15 |
| Merchant Graph Diversity | Unique counterparty addresses | 15 |
| Lightning Activity Bonus | Small/frequent output patterns | 10 |
| Temporal Decay Penalty | Days since last transaction | −5 to 0 |

**Total: 0–100**

### Risk Bands

| Band | Score Range | Lending Recommendation |
|---|---|---|
| 🟢 LOW_RISK | 75–100 | Eligible for unsecured micro-lending up to 0.05 BTC |
| 🟡 MEDIUM_RISK | 50–74 | Eligible with collateral or co-signer |
| 🟠 HIGH_RISK | 25–49 | Small collateralized loans only |
| 🔴 VERY_HIGH_RISK | 0–24 | Not recommended for lending at this time |

---

## API Reference

Base URL: `http://localhost:3001`

### Endpoints

#### `GET /api/reputation/:address`
Generate a full reputation score for a Bitcoin address.

```bash
curl http://localhost:3001/api/reputation/bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
```

**Response:**
```json
{
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "score": 72.4,
  "riskBand": "LOW_RISK",
  "lendingRecommendation": "Eligible for unsecured micro-lending up to 0.05 BTC",
  "factors": {
    "walletAge":          { "score": 18.2, "max": 20, "detail": "Wallet active for ~332 days" },
    "txFrequency":        { "score": 14.0, "max": 20, "detail": "35 transactions found" },
    "utxoHealth":         { "score": 12.0, "max": 15, "detail": "4 UTXOs, 284000 sats total" },
    "paymentConsistency": { "score": 10.5, "max": 15, "detail": "Regularity of payment intervals analyzed" },
    "merchantGraph":      { "score": 11.0, "max": 15, "detail": "18 unique counterparties detected" },
    "lightningActivity":  { "score":  8.0, "max": 10, "detail": "8 likely Lightning-related transactions" },
    "temporalDecay":      { "score": -1.3, "max":  0, "detail": "Inactive for 95 days — penalty applied" }
  },
  "commitment": {
    "hash": "a3f7c9d2e1b4...",
    "opReturnHex": "424954...",
    "timestamp": "2026-06-13T10:00:00.000Z"
  },
  "generatedAt": "2026-06-13T10:00:00.000Z"
}
```

---

#### `GET /api/reputation/:address/verify`
Trustlessly verify a previously issued score commitment.

**Query params:** `score`, `riskBand`, `timestamp`, `hash`

```bash
curl "http://localhost:3001/api/reputation/bc1q.../verify?score=72.4&riskBand=LOW_RISK&timestamp=2026-06-13T10:00:00.000Z&hash=a3f7c9..."
```

---

#### `GET /api/reputation/:address/commitment`
Fetch only the on-chain commitment for a given address (must be scored first).

---

#### `GET /api/health`
Check backend status.

```json
{ "status": "ok", "service": "BitOracle", "timestamp": "..." }
```

---

## Architecture

```
Bitcoin Network (mempool.space public API)
          │
          ▼
  ┌─────────────────┐
  │  Data Ingestion  │  ← services/bitcoin.js
  │  (txs, UTXOs)   │     fetches raw on-chain data
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  Scoring Engine  │  ← core/scorer.js
  │  7-factor model  │     produces 0–100 score + breakdown
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │   Oracle Layer   │  ← core/oracle.js
  │  HMAC + OP_RET  │     issues & verifies commitments
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │    REST API      │  ← routes/reputation.js + server.js
  │    (Express)     │     rate-limited, CORS-enabled
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │ React Dashboard  │  ← frontend/src/
  │  Score · Chart   │     Gauge, Radar, Commitment card,
  │  Passport · API  │     Lending Passport PDF + QR code
  └─────────────────┘
```

---

## Project Structure

```
bitdev/
├── backend/
│   ├── core/
│   │   ├── scorer.js        # 7-factor AI scoring engine
│   │   └── oracle.js        # HMAC commitment + OP_RETURN simulation
│   ├── routes/
│   │   └── reputation.js    # Express route handlers
│   ├── services/
│   │   └── bitcoin.js       # mempool.space data ingestion
│   ├── server.js            # Entry point, middleware setup
│   └── .env                 # PORT, MEMPOOL_API, ORACLE_SECRET
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Landing.jsx  # Marketing landing page
        │   ├── Home.jsx     # Score input + demo addresses
        │   ├── Result.jsx   # Full score result dashboard
        │   └── Docs.jsx     # API & scoring documentation
        └── components/
            ├── ScoreGauge.jsx      # SVG arc gauge
            ├── FactorsChart.jsx    # Recharts radar chart
            ├── CommitmentCard.jsx  # On-chain commitment display
            └── LendingPassport.jsx # PDF export with QR code
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm run dev
# → http://localhost:3001
```

`.env` (already included):
```
PORT=3001
MEMPOOL_API=https://mempool.space/api
ORACLE_SECRET=bitdevs-buk-2026-secret
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Make sure `frontend/.env` points to your backend:
```
VITE_API_URL=http://localhost:3001
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend runtime | Node.js 18 + ES Modules |
| API framework | Express 5 |
| Security | Helmet · express-rate-limit · CORS |
| Crypto | Node built-in `crypto` (HMAC-SHA256) |
| Blockchain data | mempool.space REST API (no API key required) |
| Frontend | React 18 · Vite · React Router 6 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| PDF export | jsPDF + QRCode.js |

---

## Design Principles

- **No custody** — BitOracle never touches funds, only reads public data
- **No KYC** — identity is replaced by on-chain behavior
- **Verifiable** — every score has a cryptographic commitment that any party can verify independently
- **Explainable** — every point in the score is traceable to a specific on-chain signal
- **Sovereign** — MSMEs own their score; no account, no login, no data stored beyond the commitment ledger

---

## Hackathon Theme Alignment

The challenge brief specified the following on-chain signals — BitOracle implements all of them:

| Brief Requirement | BitOracle Implementation |
|---|---|
| UTXO age | `walletAge` factor — oldest tx timestamp delta |
| Transaction frequency | `txFrequency` factor — total tx count normalized |
| Lightning Network node liquidity | `lightningActivity` factor — inferred from small/frequent outputs |
| Script-based payment patterns | `paymentConsistency` + `merchantGraph` — output scripts analyzed |

---

## License

MIT © 2026 BitOracle · Built at BOI-BUK Innovation Hub, BUK New Site, Kano
