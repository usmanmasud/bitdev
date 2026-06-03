import { useState } from "react";

export default function CommitmentCard({ commitment, address }) {
  const [copied, setCopied] = useState(false);

  function copy(text) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-gray-900 border border-orange-900 rounded-2xl p-6 shadow-xl">
      <h2 className="text-sm font-semibold text-orange-400 mb-1">🔗 On-Chain Reputation Commitment</h2>
      <p className="text-xs text-gray-500 mb-4">
        This hash anchors your reputation score. It can be stored in Bitcoin via OP_RETURN for
        tamper-proof attestation.
      </p>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Commitment Hash (HMAC-SHA256)</p>
          <div className="flex items-center gap-2">
            <code className="text-xs text-green-400 font-mono bg-gray-800 rounded px-3 py-2 flex-1 truncate">
              {commitment.hash}
            </code>
            <button
              onClick={() => copy(commitment.hash)}
              className="text-xs text-gray-400 hover:text-orange-400 bg-gray-800 rounded px-2 py-2 transition"
            >
              {copied ? "✓" : "Copy"}
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">OP_RETURN Hex (simulated broadcast)</p>
          <code className="text-xs text-blue-400 font-mono bg-gray-800 rounded px-3 py-2 block truncate">
            {commitment.opReturnHex}
          </code>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Verify via API</p>
          <code className="text-xs text-gray-400 font-mono bg-gray-800 rounded px-3 py-2 block truncate">
            GET /api/reputation/{address.slice(0, 12)}…/verify?hash={commitment.hash.slice(0, 16)}…
          </code>
        </div>
      </div>
    </div>
  );
}
