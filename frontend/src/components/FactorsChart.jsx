import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
} from "recharts";

export default function FactorsChart({ factors }) {
  const data = factors
    .filter((f) => f.max > 0)
    .map((f) => ({
      subject: f.name.split(" ").slice(0, 2).join(" "),
      value: f.max > 0 ? +((f.score / f.max) * 100).toFixed(1) : 0,
    }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 10 }} />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#f97316"
          fill="#f97316"
          fillOpacity={0.25}
        />
        <Tooltip
          contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8 }}
          labelStyle={{ color: "#f97316" }}
          itemStyle={{ color: "#fff" }}
          formatter={(v) => [`${v}%`, "Score"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
