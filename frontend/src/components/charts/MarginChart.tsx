import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type MarginChartProps = {
  data: Array<Record<string, number | string>>;
};

export function MarginChart({ data }: MarginChartProps) {
  return (
    <div className="h-64 min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={256} initialDimension={{ width: 320, height: 256 }}>
        <BarChart data={data} margin={{ left: -18, right: 12, top: 12, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#9aa4b2", fontSize: 11, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis tick={{ fill: "#9aa4b2", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.045)" }}
            contentStyle={{
              background: "rgba(16,20,27,0.96)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Bar dataKey="margin" fill="#65f0b7" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
