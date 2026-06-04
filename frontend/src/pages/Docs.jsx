import { useNavigate } from "react-router-dom";

const SCORING = [
  { dimension: "Wallet Age & Longevity", max: 20 },
  { dimension: "Transaction Frequency", max: 20 },
  { dimension: "UTXO Health", max: 15 },
  { dimension: "Payment Consistency", max: 15 },
  { dimension: "Merchant Graph Diversity", max: 15 },
  { dimension: "Lightning Activity Bonus", max: 10 },
  { dimension: "Temporal Decay Penalty", max: "−5 to 0" },
];

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/reputation/:address",
    desc: "Generate a full reputation score for a Bitcoin address.",
  },
  {
    method: "GET",
    path: "/api/reputation/:address/verify?score=&riskBand=&timestamp=&hash=",
    desc: "Verify a previously issued score commitment — use this to trustlessly confirm a score without calling BitOracle directly.",
  },
  {
    method: "GET",
    path: "/api/reputation/:address/commitment",
    desc: "Fetch only the on-chain commitment hash and OP_RETURN hex for a given address.",
  },
  {
    method: "GET",
    path: "/api/health",
    desc: "Check if the BitOracle backend is online.",
  },
];

const EXAMPLE_RESPONSE = `{
  "address": "bc1q8p86yh7k...",
  "score": 72.4,
  "riskBand": "LOW_RISK",
  "lendingRecommendation": "Eligible for unsecured micro-lending up to 0.05 BTC",
  "factors": {
    "walletAge":   { "score": 18.2, "max": 20, "detail": "Wallet active for ~332 days" },
    "txFrequency": { "score": 14.0, "max": 20, "detail": "35 transactions found" },
    "utxoHealth":  { "score": 12.0, "max": 15, "detail": "Healthy UTXO set" }
  },
  "commitment": {
    "hash": "a3f7c9...",
    "opReturnHex": "424954...",
    "timestamp": "2026-06-13T10:00:00.000Z"
  },
  "generatedAt": "2026-06-13T10:00:00.000Z"
}`;

const RISK_BANDS = [
  { band: "LOW_RISK", range: "75–100", color: "text-green-400", rec: "Eligible for unsecured micro-lending" },
  { band: "MEDIUM_RISK", range: "50–74", color: "text-yellow-400", rec: "Eligible with collateral or co-signer" },
  { band: "HIGH_RISK", range: "25–49", color: "text-orange-400", rec: "Limited lending — higher interest rates apply" },
  { band: "VERY_HIGH_RISK", range: "0–24", color: "text-red-400", rec: "Not recommended for lending at this time" },
];

export default function Docs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-xs text-gray-500 hover:text-orange-400 mb-6 block transition"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="text-4xl mb-2">📖</div>
          <h1 className="text-2xl font-bold text-orange-400">BitOracle Docs</h1>
          <p className="text-gray-400 text-sm mt-1">
            How the scoring works, what the API returns, and how to integrate.
          </p>
        </div>

        {/* What is BitOracle */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-2">What is BitOracle?</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            BitOracle is a decentralized reputation scoring engine for Bitcoin wallets. It ingests
            public on-chain data from{" "}
            <a href="https://mempool.space" target="_blank" rel="noreferrer" className="text-orange-400 hover:underline">
              mempool.space
            </a>{" "}
            and produces a verifiable, explainable score (0–100) that MSMEs can use to unlock
            micro-lending and B2B partnerships — no KYC, no bank, no intermediary.
          </p>
        </section>

        {/* Scoring Model */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Scoring Model</h2>
          <p className="text-xs text-gray-500 mb-3">7 factors contribute to the final score out of 100:</p>
          <div className="space-y-2">
            {SCORING.map((s) => (
              <div key={s.dimension} className="flex justify-between items-center">
                <p className="text-xs text-gray-300">{s.dimension}</p>
                <span className="text-xs font-bold text-orange-400">{s.max} pts</span>
              </div>
            ))}
          </div>
        </section>

        {/* Risk Bands */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Risk Bands</h2>
          <div className="space-y-3">
            {RISK_BANDS.map((r) => (
              <div key={r.band}>
                <div className="flex justify-between">
                  <span className={`text-xs font-bold ${r.color}`}>{r.band.replace(/_/g, " ")}</span>
                  <span className="text-xs text-gray-500">Score {r.range}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{r.rec}</p>
              </div>
            ))}
          </div>
        </section>

        {/* API Reference */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">API Reference</h2>
          <div className="space-y-4">
            {ENDPOINTS.map((e) => (
              <div key={e.path}>
                <pre className="bg-gray-800 text-orange-300 text-xs rounded-lg px-3 py-2 overflow-x-auto">
                  {e.method} {e.path}
                </pre>
                <p className="text-xs text-gray-500 mt-1">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Example Response */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Example Response</h2>
          <pre className="bg-gray-800 text-orange-300 text-xs rounded-lg p-3 overflow-x-auto">
            {EXAMPLE_RESPONSE}
          </pre>
        </section>

        {/* On-chain Commitment */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-2">On-chain Commitment</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Every score is accompanied by an HMAC-SHA256 commitment hash anchored via a simulated
            OP_RETURN transaction. This lets any third party verify a score was issued at a specific
            time without trusting BitOracle — just call the <span className="text-orange-400">/verify</span> endpoint
            with the score, riskBand, timestamp, and hash.
          </p>
        </section>

        {/* No KYC notice */}
        <p className="text-center text-xs text-gray-700 mt-6">
          BitOracle v1.0 · Powered by mempool.space · Non-custodial · No KYC
        </p>
      </div>
    </div>
  );
}
