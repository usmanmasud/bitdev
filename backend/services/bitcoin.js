// Fetches raw on-chain data from mempool.space
import axios from "axios";

const BASE = process.env.MEMPOOL_API;

export async function getAddressData(address) {
  const [info, txs, utxos] = await Promise.all([
    axios.get(`${BASE}/address/${address}`),
    axios.get(`${BASE}/address/${address}/txs`),
    axios.get(`${BASE}/address/${address}/utxo`),
  ]);
  return { info: info.data, txs: txs.data, utxos: utxos.data };
}

export async function getTransaction(txid) {
  const res = await axios.get(`${BASE}/tx/${txid}`);
  return res.data;
}
