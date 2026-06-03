/**
 * AI Reputation Scoring Engine
 * Produces a 0-100 score with full explainability breakdown
 *
 * Scoring dimensions:
 *  1. Wallet Age & Longevity       (20pts)
 *  2. Transaction Frequency        (20pts)
 *  3. UTXO Health                  (15pts)
 *  4. Payment Consistency          (15pts)
 *  5. Merchant Graph Diversity     (15pts)
 *  6. Lightning Activity Bonus     (10pts) — inferred from tx patterns
 *  7. Temporal Decay Penalty       (-5 to 0)
 */

const NOW = Math.floor(Date.now() / 1000);
const SECONDS_PER_DAY = 86400;

export function computeScore(address, info, txs, utxos) {
  const factors = {};
  let total = 0;

  // 1. Wallet Age & Longevity
  const oldestTx = txs.reduce((min, t) => {
    const ts = t.status?.block_time || NOW;
    return ts < min ? ts : min;
  }, NOW);
  const ageInDays = (NOW - oldestTx) / SECONDS_PER_DAY;
  const ageScore = Math.min(20, (ageInDays / 365) * 20);
  factors.walletAge = {
    score: +ageScore.toFixed(2),
    max: 20,
    detail: `Wallet active for ~${Math.floor(ageInDays)} days`,
  };
  total += ageScore;

  // 2. Transaction Frequency (consistency over time)
  const txCount = txs.length;
  const freqScore = Math.min(20, (txCount / 50) * 20);
  factors.txFrequency = {
    score: +freqScore.toFixed(2),
    max: 20,
    detail: `${txCount} transactions found`,
  };
  total += freqScore;

  // 3. UTXO Health (number of unspent outputs, diversity)
  const utxoCount = utxos.length;
  const totalSats = utxos.reduce((s, u) => s + u.value, 0);
  const utxoScore = Math.min(15, (utxoCount / 10) * 10 + (totalSats > 100000 ? 5 : 0));
  factors.utxoHealth = {
    score: +utxoScore.toFixed(2),
    max: 15,
    detail: `${utxoCount} UTXOs, ${totalSats} sats total`,
  };
  total += utxoScore;

  // 4. Payment Consistency (regular intervals between txs)
  const timestamps = txs
    .map((t) => t.status?.block_time)
    .filter(Boolean)
    .sort((a, b) => a - b);
  let consistencyScore = 0;
  if (timestamps.length > 2) {
    const gaps = [];
    for (let i = 1; i < timestamps.length; i++) gaps.push(timestamps[i] - timestamps[i - 1]);
    const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const variance = gaps.reduce((sum, g) => sum + Math.pow(g - avg, 2), 0) / gaps.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / avg; // coefficient of variation — lower = more consistent
    consistencyScore = Math.min(15, (1 - Math.min(cv, 1)) * 15);
  }
  factors.paymentConsistency = {
    score: +consistencyScore.toFixed(2),
    max: 15,
    detail: timestamps.length > 2 ? "Regularity of payment intervals analyzed" : "Not enough data",
  };
  total += consistencyScore;

  // 5. Merchant Graph Diversity (unique counterparties)
  const counterparties = new Set();
  txs.forEach((tx) => {
    tx.vout?.forEach((out) => {
      if (out.scriptpubkey_address && out.scriptpubkey_address !== address)
        counterparties.add(out.scriptpubkey_address);
    });
    tx.vin?.forEach((inp) => {
      if (inp.prevout?.scriptpubkey_address && inp.prevout.scriptpubkey_address !== address)
        counterparties.add(inp.prevout.scriptpubkey_address);
    });
  });
  const graphScore = Math.min(15, (counterparties.size / 20) * 15);
  factors.merchantGraph = {
    score: +graphScore.toFixed(2),
    max: 15,
    detail: `${counterparties.size} unique counterparties detected`,
  };
  total += graphScore;

  // 6. Lightning Activity Bonus (infer from small, frequent outputs — typical LN behavior)
  const lnLikeTxs = txs.filter((tx) => {
    const outs = tx.vout || [];
    return outs.length >= 2 && outs.some((o) => o.value < 10000 && o.value > 0);
  });
  const lnScore = Math.min(10, (lnLikeTxs.length / 10) * 10);
  factors.lightningActivity = {
    score: +lnScore.toFixed(2),
    max: 10,
    detail: `${lnLikeTxs.length} likely Lightning-related transactions`,
  };
  total += lnScore;

  // 7. Temporal Decay Penalty (if no recent activity)
  const lastTxTime = timestamps[timestamps.length - 1] || 0;
  const daysSinceLast = (NOW - lastTxTime) / SECONDS_PER_DAY;
  const decayPenalty = daysSinceLast > 180 ? -5 : daysSinceLast > 90 ? -2 : 0;
  factors.temporalDecay = {
    score: +decayPenalty.toFixed(2),
    max: 0,
    detail:
      decayPenalty < 0
        ? `Inactive for ${Math.floor(daysSinceLast)} days — penalty applied`
        : "Recent activity — no penalty",
  };
  total += decayPenalty;

  const finalScore = Math.max(0, Math.min(100, +total.toFixed(2)));
  const riskBand = getRiskBand(finalScore);

  return {
    address,
    score: finalScore,
    riskBand,
    lendingRecommendation: getLendingRec(finalScore),
    factors,
    generatedAt: new Date().toISOString(),
  };
}

function getRiskBand(score) {
  if (score >= 75) return "LOW_RISK";
  if (score >= 50) return "MEDIUM_RISK";
  if (score >= 25) return "HIGH_RISK";
  return "VERY_HIGH_RISK";
}

function getLendingRec(score) {
  if (score >= 75) return "Eligible for unsecured micro-lending up to 0.05 BTC";
  if (score >= 50) return "Eligible for collateralized lending — moderate terms";
  if (score >= 25) return "Limited eligibility — small collateralized loans only";
  return "Not recommended for lending at this time";
}
