// Visual arc gauge showing score 0-100
export default function ScoreGauge({ score }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const arc = circ * 0.75; // 270 degree arc
  const fill = arc * (score / 100);
  const offset = circ * 0.125; // start at 135deg

  const color = score >= 75 ? "#4ade80" : score >= 50 ? "#facc15" : score >= 25 ? "#fb923c" : "#f87171";

  return (
    <svg width="120" height="100" viewBox="0 0 120 100">
      {/* Background arc */}
      <circle
        cx="60" cy="70" r={radius}
        fill="none" stroke="#374151" strokeWidth="10"
        strokeDasharray={`${arc} ${circ}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        transform="rotate(0 60 70)"
      />
      {/* Score arc */}
      <circle
        cx="60" cy="70" r={radius}
        fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${fill} ${circ}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      <text x="60" y="65" textAnchor="middle" fill={color} fontSize="22" fontWeight="bold">
        {score}
      </text>
      <text x="60" y="80" textAnchor="middle" fill="#9ca3af" fontSize="9">
        / 100
      </text>
    </svg>
  );
}
