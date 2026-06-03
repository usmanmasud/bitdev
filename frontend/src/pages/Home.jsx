import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = address.trim();
    if (trimmed.length < 26) {
      setError("Enter a valid Bitcoin address");
      return;
    }
    navigate(`/result/${trimmed}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-3xl font-bold text-orange-400 tracking-tight">BitOracle</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Decentralized AI Reputation Scoring for Bitcoin MSMEs
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
            Bitcoin Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => { setAddress(e.target.value); setError(""); }}
            placeholder="bc1q... or 1A1z..."
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition"
          />
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          <button
            type="submit"
            className="mt-4 w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 rounded-lg transition text-sm"
          >
            Generate Reputation Score →
          </button>
        </form>

        <div className="mt-4 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-500">
            💡 Enter any real Bitcoin address with transaction history from
            {" "}<a href="https://mempool.space" target="_blank" rel="noreferrer" className="text-orange-400 hover:underline">mempool.space</a>
          </p>
        </div>

        <p className="text-center text-xs text-gray-700 mt-8">
          Powered by mempool.space · Non-custodial · No KYC
        </p>
      </div>
    </div>
  );
}
