import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = address.trim();
    if (!trimmed) {
      setError("Please enter a Bitcoin address.");
      return;
    }
    if (trimmed.length < 26 || trimmed.length > 62) {
      setError("That doesn't look like a valid Bitcoin address.");
      return;
    }
    if (!/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,61}$/.test(trimmed)) {
      setError("Invalid format. Bitcoin addresses start with bc1, 1, or 3.");
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

        <div className="flex justify-center mt-8">
          <Link
            to="/docs"
            className="text-xs text-gray-500 hover:text-orange-400 transition border border-gray-800 rounded-lg px-4 py-2"
          >
            📖 How it works & API docs
          </Link>
        </div>
        <p className="text-center text-xs text-gray-700 mt-4">
          Powered by mempool.space · Non-custodial · No KYC
        </p>
      </div>
    </div>
  );
}
