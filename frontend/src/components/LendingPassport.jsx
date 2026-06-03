import { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const RISK_COLOR = {
  LOW_RISK: "#4ade80",
  MEDIUM_RISK: "#facc15",
  HIGH_RISK: "#fb923c",
  VERY_HIGH_RISK: "#f87171",
};

const RISK_LABEL = {
  LOW_RISK: "LOW RISK",
  MEDIUM_RISK: "MEDIUM RISK",
  HIGH_RISK: "HIGH RISK",
  VERY_HIGH_RISK: "VERY HIGH RISK",
};

export default function LendingPassport({ data }) {
  const [generating, setGenerating] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const verifyUrl = `http://localhost:3001/api/reputation/${data.address}/verify?score=${data.score}&riskBand=${data.riskBand}&timestamp=${encodeURIComponent(data.commitment.timestamp)}&hash=${data.commitment.hash}`;

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, { width: 120, margin: 1, color: { dark: "#f97316", light: "#111827" } })
      .then(setQrDataUrl);
  }, [verifyUrl]);

  async function generatePDF() {
    setGenerating(true);
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210;
      const riskColor = RISK_COLOR[data.riskBand];

      // Background
      pdf.setFillColor(17, 24, 39);
      pdf.rect(0, 0, W, 297, "F");

      // Orange top bar
      pdf.setFillColor(249, 115, 22);
      pdf.rect(0, 0, W, 18, "F");

      // Header text
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.text("⚡ BitOracle", 14, 12);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text("DECENTRALIZED LENDING PASSPORT", W - 14, 12, { align: "right" });

      // Card background
      pdf.setFillColor(31, 41, 55);
      pdf.roundedRect(10, 24, W - 20, 80, 4, 4, "F");

      // Score circle
      pdf.setFillColor(17, 24, 39);
      pdf.circle(38, 58, 18, "F");
      const [r, g, b] = hexToRgb(riskColor);
      pdf.setDrawColor(r, g, b);
      pdf.setLineWidth(2);
      pdf.circle(38, 58, 18, "S");
      pdf.setTextColor(r, g, b);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(data.score), 38, 62, { align: "center" });
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.text("/ 100", 38, 68, { align: "center" });

      // Risk band badge
      pdf.setFillColor(r, g, b);
      pdf.roundedRect(62, 28, 50, 8, 2, 2, "F");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.text(RISK_LABEL[data.riskBand], 87, 33.5, { align: "center" });

      // Address
      pdf.setTextColor(156, 163, 175);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.text("BITCOIN ADDRESS", 62, 45);
      pdf.setTextColor(251, 191, 36);
      pdf.setFontSize(7.5);
      pdf.text(data.address.slice(0, 34), 62, 51);
      if (data.address.length > 34) pdf.text(data.address.slice(34), 62, 56);

      // Lending recommendation
      pdf.setTextColor(156, 163, 175);
      pdf.setFontSize(7);
      pdf.text("LENDING RECOMMENDATION", 62, 65);
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(7.5);
      const recLines = pdf.splitTextToSize(data.lendingRecommendation, 130);
      pdf.text(recLines, 62, 71);

      // Issued date
      pdf.setTextColor(107, 114, 128);
      pdf.setFontSize(6.5);
      pdf.text(`Issued: ${new Date(data.generatedAt).toUTCString()}`, 14, 97);

      // Score breakdown section
      pdf.setTextColor(249, 115, 22);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("SCORE BREAKDOWN", 14, 115);

      pdf.setDrawColor(55, 65, 81);
      pdf.setLineWidth(0.3);
      pdf.line(14, 118, W - 14, 118);

      const factors = Object.entries(data.factors);
      let y = 126;
      factors.forEach(([key, val]) => {
        const label = key.replace(/([A-Z])/g, " $1").trim();
        const pct = val.max > 0 ? val.score / val.max : 0;
        const barW = 80;

        pdf.setTextColor(209, 213, 219);
        pdf.setFontSize(7.5);
        pdf.setFont("helvetica", "normal");
        pdf.text(label.charAt(0).toUpperCase() + label.slice(1), 14, y);

        // Bar background
        pdf.setFillColor(55, 65, 81);
        pdf.roundedRect(80, y - 4, barW, 4, 1, 1, "F");

        // Bar fill
        const [fr, fg, fb] = hexToRgb(pct > 0.66 ? "#4ade80" : pct > 0.33 ? "#facc15" : "#f87171");
        pdf.setFillColor(fr, fg, fb);
        pdf.roundedRect(80, y - 4, barW * pct, 4, 1, 1, "F");

        // Score text
        pdf.setTextColor(249, 115, 22);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${val.score} / ${val.max}`, W - 14, y, { align: "right" });

        // Detail
        pdf.setTextColor(107, 114, 128);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(6);
        pdf.text(val.detail, 14, y + 4);

        y += 14;
      });

      // On-chain commitment section
      y += 4;
      pdf.setFillColor(31, 41, 55);
      pdf.roundedRect(10, y, W - 20, 52, 4, 4, "F");

      pdf.setTextColor(249, 115, 22);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("ON-CHAIN REPUTATION COMMITMENT", 18, y + 10);

      pdf.setTextColor(156, 163, 175);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.text("HMAC-SHA256 HASH", 18, y + 18);
      pdf.setTextColor(74, 222, 128);
      pdf.setFontSize(6.5);
      pdf.text(data.commitment.hash, 18, y + 24);

      pdf.setTextColor(156, 163, 175);
      pdf.setFontSize(7);
      pdf.text("OP_RETURN HEX", 18, y + 32);
      pdf.setTextColor(147, 197, 253);
      pdf.setFontSize(6.5);
      pdf.text(data.commitment.opReturnHex.slice(0, 60) + "...", 18, y + 38);

      // QR code
      if (qrDataUrl) {
        pdf.addImage(qrDataUrl, "PNG", W - 44, y + 6, 34, 34);
        pdf.setTextColor(107, 114, 128);
        pdf.setFontSize(5.5);
        pdf.text("Scan to verify", W - 27, y + 44, { align: "center" });
      }

      // Footer
      pdf.setFillColor(249, 115, 22);
      pdf.rect(0, 285, W, 12, "F");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.text("BitOracle · Decentralized AI Reputation for Bitcoin MSMEs · BitDevs BUK Hackathon 2026", W / 2, 293, { align: "center" });

      pdf.save(`BitOracle_Passport_${data.address.slice(0, 12)}.pdf`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-orange-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-orange-400">🪪 Lending Passport</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Download a verifiable PDF credential with QR code
          </p>
        </div>
        <button
          onClick={generatePDF}
          disabled={generating || !qrDataUrl}
          className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-xs px-5 py-2.5 rounded-lg transition"
        >
          {generating ? "Generating..." : "Download PDF →"}
        </button>
      </div>

      {/* Preview card */}
      <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-4 border border-gray-700">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center border-2 flex-shrink-0"
          style={{ borderColor: RISK_COLOR[data.riskBand] }}
        >
          <span className="font-black text-lg" style={{ color: RISK_COLOR[data.riskBand] }}>
            {data.score}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold" style={{ color: RISK_COLOR[data.riskBand] }}>
            {RISK_LABEL[data.riskBand]}
          </p>
          <p className="text-xs text-gray-400 truncate">{data.address}</p>
          <p className="text-xs text-gray-500 mt-0.5">{data.lendingRecommendation}</p>
        </div>
        {qrDataUrl && (
          <img src={qrDataUrl} alt="QR" className="w-12 h-12 rounded flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}
