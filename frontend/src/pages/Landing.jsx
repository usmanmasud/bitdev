import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🧠",
    title: "Explainable AI Score",
    desc: "7-factor breakdown — not a black box. Every point is justified.",
  },
  {
    icon: "🔗",
    title: "On-chain Commitment",
    desc: "HMAC-SHA256 hash anchored via OP_RETURN. Tamper-proof & verifiable.",
  },
  {
    icon: "🏪",
    title: "Merchant Graph Analysis",
    desc: "Detects B2B diversity from counterparty addresses on-chain.",
  },
  {
    icon: "⚡",
    title: "Lightning Activity Inference",
    desc: "Infers Lightning Network behavior from small, frequent outputs.",
  },
  {
    icon: "📉",
    title: "Temporal Decay Penalty",
    desc: "Dormant wallets are penalized. Active wallets are rewarded.",
  },
  {
    icon: "🔌",
    title: "Oracle API",
    desc: "One GET request. Plug your score into any lending app or marketplace.",
  },
];

const STEPS = [
  { n: "01", title: "Enter a Bitcoin address", desc: "Any wallet with on-chain history — no sign-up, no KYC." },
  { n: "02", title: "We analyze the chain", desc: "BitOracle pulls live data from mempool.space and runs 7 scoring factors." },
  { n: "03", title: "Get your score", desc: "A 0–100 reputation score with full breakdown and risk band in seconds." },
  { n: "04", title: "Use it anywhere", desc: "Share the commitment hash or call the Oracle API to integrate with lenders." },
];

const SCORING = [
  { label: "Wallet Age & Longevity", pts: 20 },
  { label: "Transaction Frequency", pts: 20 },
  { label: "UTXO Health", pts: 15 },
  { label: "Payment Consistency", pts: 15 },
  { label: "Merchant Graph Diversity", pts: 15 },
  { label: "Lightning Activity Bonus", pts: 10 },
  { label: "Temporal Decay Penalty", pts: "−5" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950 text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="font-bold text-orange-400 text-lg tracking-tight">BitOracle</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/docs" className="text-xs text-gray-400 hover:text-orange-400 transition">Docs</Link>
          <Link
            to="/app"
            className="text-xs bg-orange-500 hover:bg-orange-400 text-black font-bold px-4 py-2 rounded-lg transition"
          >
            Launch App →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-4 pt-20 pb-24 max-w-3xl mx-auto">
        <div className="inline-block bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          Built for BitDevs BUK Hackathon 2026 · BOI-BUK Innovation Hub
        </div>
        <h1 className="text-5xl font-black tracking-tight leading-tight mb-4">
          Bitcoin Reputation.<br />
          <span className="text-orange-400">No Bank. No KYC.</span>
        </h1>
        <p className="text-gray-400 text-base max-w-xl mx-auto mb-8">
          BitOracle ingests public on-chain history for any Bitcoin wallet and produces a verifiable,
          explainable reputation score — so MSMEs can unlock lending and B2B partnerships on-chain.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/app"
            className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-6 py-3 rounded-xl text-sm transition"
          >
            Score a Wallet →
          </Link>
          <Link
            to="/docs"
            className="border border-gray-700 hover:border-orange-500 text-gray-300 hover:text-orange-400 px-6 py-3 rounded-xl text-sm transition"
          >
            Read the Docs
          </Link>
        </div>
      </section>

      {/* The Problem */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-8">The Problem</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { stat: "1.7B", label: "Adults globally without access to formal banking" },
            { stat: "90%", label: "Of MSMEs in emerging markets lack a credit score" },
            { stat: "$5.7T", label: "Annual MSME financing gap in developing economies" },
          ].map((s) => (
            <div key={s.stat} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <p className="text-4xl font-black text-orange-400 mb-2">{s.stat}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 border border-orange-900/40 rounded-2xl p-6">
          <p className="text-sm text-gray-300 leading-relaxed text-center">
            Millions of informal MSMEs in Nigeria and across the globe operate without access to credit —
            not because they aren't creditworthy, but because <span className="text-orange-400 font-semibold">no one has looked at the right data</span>.
            Bitcoin's public ledger contains everything needed to build a trust score — we just built the engine to read it.
          </p>
        </div>
      </section>

      {/* Hackathon theme alignment */}
      <section className="max-w-3xl mx-auto px-4 mb-20">
        <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-6">Directly addresses the hackathon brief</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: "🔒", label: "UTXO Age", desc: "Analyzed per output" },
            { icon: "🔁", label: "Tx Frequency", desc: "Consistency scored" },
            { icon: "⚡", label: "Lightning Activity", desc: "Inferred from patterns" },
            { icon: "📜", label: "Script Patterns", desc: "Payment type analyzed" },
          ].map((t) => (
            <div key={t.label} className="bg-gray-900 border border-orange-900/30 rounded-xl p-4 text-center">
              <div className="text-xl mb-1">{t.icon}</div>
              <p className="text-xs font-bold text-orange-400">{t.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Score preview bar */}
      <section className="max-w-2xl mx-auto px-4 mb-20">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 text-center">Scoring Model · 7 Factors · 0–100</p>
          <div className="space-y-2">
            {SCORING.map((s) => (
              <div key={s.label} className="flex justify-between items-center">
                <span className="text-xs text-gray-300">{s.label}</span>
                <span className="text-xs font-bold text-orange-400">{s.pts} pts</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 mb-24">
        <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-8">What makes BitOracle different</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 mb-24">
        <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-8">How it works</p>
        <div className="space-y-4">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-4 items-start bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <span className="text-orange-400 font-black text-xl leading-none mt-0.5">{s.n}</span>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-xs text-gray-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-4 pb-24">
        <div className="max-w-lg mx-auto bg-gray-900 border border-orange-500/20 rounded-2xl p-10">
          <div className="text-4xl mb-4">⚡</div>
          <h2 className="text-2xl font-black mb-2">Ready to score a wallet?</h2>
          <p className="text-gray-400 text-sm mb-6">
            Enter any Bitcoin address. Get a verifiable reputation score in seconds.
          </p>
          <Link
            to="/app"
            className="inline-block bg-orange-500 hover:bg-orange-400 text-black font-bold px-8 py-3 rounded-xl text-sm transition"
          >
            Launch BitOracle →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-700 pb-8">
        BitOracle v1.0 · Powered by mempool.space · Non-custodial · No KYC · BOI-BUK Innovation Hub
      </footer>

    </div>
  );
}
