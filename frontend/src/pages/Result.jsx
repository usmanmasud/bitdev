import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ScoreGauge from "../components/ScoreGauge";
import FactorsChart from "../components/FactorsChart";
import CommitmentCard from "../components/CommitmentCard";
import LendingPassport from "../components/LendingPassport";

const RISK_COLOR = {
  LOW_RISK: "text-green-400",
  MEDIUM_RISK: "text-yellow-400",
  HIGH_RISK: "text-orange-400",
  VERY_HIGH_RISK: "text-red-400",
};

export default function Result() {
  const { address } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/reputation/${address}`)
      .then((r) => setData(r.data))
      .catch((e) => {
        const status = e.response?.status;
        const msg = e.response?.data?.error;
        if (!e.response) {
          setError("Cannot connect to BitOracle backend. Make sure the server is running.");
        } else if (status === 400 || msg?.toLowerCase().includes("invalid")) {
          setError("Invalid Bitcoin address. Please check the address and try again.");
        } else if (status === 404) {
          setError("Address not found on the Bitcoin network.");
        } else if (status === 429) {
          setError("Too many requests. Please wait a moment and try again.");
        } else if (status >= 500) {
          setError("Failed to fetch on-chain data. mempool.space may be temporarily unavailable.");
        } else {
          setError(msg || "Something went wrong. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [address]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-orange-400 text-lg animate-pulse">⚡ Analyzing on-chain data...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-900 border border-red-900 rounded-2xl p-8 text-center shadow-xl">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-white font-bold text-lg mb-2">Unable to Score Address</h2>
          <p className="text-red-400 text-sm mb-2">{error}</p>
          <p className="text-gray-600 text-xs mb-6 font-mono break-all">{address}</p>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-2.5 rounded-lg text-sm transition"
            >
              ← Try Another Address
            </button>
            <a
              href="https://mempool.space"
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm transition"
            >
              Find a valid address on mempool.space →
            </a>
          </div>
        </div>
      </div>
    );

  const factors = Object.entries(data.factors).map(([key, val]) => ({
    name: key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^./, (s) => s.toUpperCase()),
    score: val.score,
    max: val.max || 10,
    detail: val.detail,
  }));

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
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4 shadow-xl">
          <p className="text-xs text-gray-500 mb-1">Bitcoin Address</p>
          <p className="text-sm text-orange-300 font-mono break-all">{data.address}</p>
          {data.mocked && (
            <div className="mt-2 flex items-center gap-2 bg-yellow-950 border border-yellow-800 rounded-lg px-3 py-2">
              <span className="text-yellow-400 text-xs">⚠️ Live blockchain data unavailable — score generated from address fingerprint (demo mode)</span>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Reputation Score</p>
              <p className="text-6xl font-black text-white mt-1">{data.score}</p>
              <p className={`text-sm font-semibold mt-1 ${RISK_COLOR[data.riskBand]}`}>
                {data.riskBand.replace(/_/g, " ")}
              </p>
            </div>
            <ScoreGauge score={data.score} />
          </div>

          <div className="mt-4 bg-gray-800 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Lending Recommendation</p>
            <p className="text-sm text-white">{data.lendingRecommendation}</p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4 shadow-xl">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Score Breakdown</h2>
          <FactorsChart factors={factors} />

          <div className="mt-4 space-y-2">
            {factors.map((f) => (
              <div key={f.name} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-white">{f.name}</p>
                  <p className="text-xs text-gray-500">{f.detail}</p>
                </div>
                <span className="text-xs font-bold text-orange-400 whitespace-nowrap">
                  {f.score} / {f.max}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* On-chain Commitment */}
        <CommitmentCard commitment={data.commitment} address={data.address} />

        {/* Lending Passport */}
        <LendingPassport data={data} />

        {/* API Usage hint */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">🔌 Oracle API</h2>
          <p className="text-xs text-gray-500 mb-2">Integrate this score into any lending app or marketplace:</p>
          <pre className="bg-gray-800 text-orange-300 text-xs rounded-lg p-3 overflow-x-auto">{`GET /api/reputation/${address.slice(0, 12)}...

{
  "score": ${data.score},
  "riskBand": "${data.riskBand}",
  "lendingRecommendation": "...",
  "commitment": { "hash": "..." }
}`}</pre>
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          Generated at {new Date(data.generatedAt).toLocaleString()} · BitOracle v1.0
        </p>
      </div>
    </div>
  );
}
