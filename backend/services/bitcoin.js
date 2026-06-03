// Fetches raw on-chain data from mempool.space
import axios from "axios";
import crypto from "crypto";

const BASE = process.env.MEMPOOL_API;
const TIMEOUT = 8000;

export async function getAddressData(address) {
  try {
    const [info, txs, utxos] = await Promise.all([
      axios.get(`${BASE}/address/${address}`, { timeout: TIMEOUT }),
      axios.get(`${BASE}/address/${address}/txs`, { timeout: TIMEOUT }),
      axios.get(`${BASE}/address/${address}/utxo`, { timeout: TIMEOUT }),
    ]);
    return { info: info.data, txs: txs.data, utxos: utxos.data, mocked: false };
  } catch (err) {
    // Network unreachable — generate deterministic mock from address hash
    console.warn(`mempool.space unreachable (${err.message}), using deterministic mock`);
    return generateMockData(address);
  }
}

function generateMockData(address) {
  // Deterministic seed from address so same address always gives same score
  const seed = parseInt(crypto.createHash("sha256").update(address).digest("hex").slice(0, 8), 16);
  const rand = (min, max) => min + (seed % (max - min + 1));

  const txCount = rand(8, 120);
  const utxoCount = rand(1, 15);
  const ageInDays = rand(30, 800);
  const now = Math.floor(Date.now() / 1000);
  const firstSeen = now - ageInDays * 86400;

  // Build fake txs array
  const txs = Array.from({ length: txCount }, (_, i) => ({
    txid: crypto.createHash("sha256").update(`${address}${i}`).digest("hex"),
    status: { block_time: firstSeen + Math.floor((i / txCount) * ageInDays * 86400) },
    vout: [
      { scriptpubkey_address: address, value: rand(10000, 500000) },
      {
        scriptpubkey_address: crypto.createHash("sha256").update(`peer${address}${i}`).digest("hex").slice(0, 34),
        value: rand(1000, 50000),
      },
    ],
    vin: [{
      prevout: {
        scriptpubkey_address: crypto.createHash("sha256").update(`sender${address}${i}`).digest("hex").slice(0, 34),
      },
    }],
  }));

  const utxos = Array.from({ length: utxoCount }, (_, i) => ({
    txid: crypto.createHash("sha256").update(`utxo${address}${i}`).digest("hex"),
    value: rand(50000, 2000000),
  }));

  return { info: {}, txs, utxos, mocked: true };
}
