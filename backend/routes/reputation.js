import express from "express";
import { getAddressData } from "../services/bitcoin.js";
import { computeScore } from "../core/scorer.js";
import { createCommitment, verifyCommitment, getCommitment } from "../core/oracle.js";

const router = express.Router();

// GET /api/reputation/:address
// Main oracle endpoint — score + explainability + commitment
router.get("/:address", async (req, res) => {
  const { address } = req.params;

  if (!address || address.length < 26) {
    return res.status(400).json({ error: "Invalid Bitcoin address" });
  }

  try {
    const { info, txs, utxos, mocked } = await getAddressData(address);
    const result = computeScore(address, info, txs, utxos);
    const commitment = createCommitment(address, result.score, result.riskBand);

    return res.json({
      ...result,
      mocked: mocked || false,
      commitment: {
        hash: commitment.commitmentHash,
        opReturnHex: commitment.opReturnHex,
        timestamp: commitment.timestamp,
      },
    });
  } catch (err) {
    const status = err.response?.status === 400 ? 400 : 500;
    return res.status(status).json({ error: err.message || "Failed to fetch on-chain data" });
  }
});

// GET /api/reputation/:address/verify?score=&riskBand=&timestamp=&hash=
router.get("/:address/verify", (req, res) => {
  const { address } = req.params;
  const { score, riskBand, timestamp, hash } = req.query;

  if (!score || !riskBand || !timestamp || !hash) {
    return res.status(400).json({ error: "Missing verification parameters" });
  }

  const valid = verifyCommitment(address, score, riskBand, timestamp, hash);
  return res.json({ valid, address, score, riskBand });
});

// GET /api/reputation/:address/commitment
// Fetch stored commitment for an address
router.get("/:address/commitment", (req, res) => {
  const commitment = getCommitment(req.params.address);
  if (!commitment) return res.status(404).json({ error: "No commitment found for this address" });
  return res.json(commitment);
});

export default router;
