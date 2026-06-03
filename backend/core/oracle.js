/**
 * Reputation Commitment — anchors a hashed score proof
 * Simulates OP_RETURN on-chain commitment (real deployment would broadcast tx)
 * Format: SHA256(address + score + timestamp + secret)
 */
import crypto from "crypto";

const ORACLE_SECRET = process.env.ORACLE_SECRET || "bitdevs-oracle";

// In-memory ledger (replace with DB in production)
const commitmentLedger = new Map();

export function createCommitment(address, score, riskBand) {
  const timestamp = new Date().toISOString();
  const payload = `${address}:${score}:${riskBand}:${timestamp}`;
  const hash = crypto
    .createHmac("sha256", ORACLE_SECRET)
    .update(payload)
    .digest("hex");

  const commitment = {
    address,
    score,
    riskBand,
    timestamp,
    commitmentHash: hash,
    // Simulated OP_RETURN hex
    opReturnHex: Buffer.from(`BITORACLE:${hash.slice(0, 32)}`).toString("hex"),
  };

  commitmentLedger.set(address, commitment);
  return commitment;
}

export function verifyCommitment(address, score, riskBand, timestamp, providedHash) {
  const payload = `${address}:${score}:${riskBand}:${timestamp}`;
  const expected = crypto
    .createHmac("sha256", ORACLE_SECRET)
    .update(payload)
    .digest("hex");
  return expected === providedHash;
}

export function getCommitment(address) {
  return commitmentLedger.get(address) || null;
}
