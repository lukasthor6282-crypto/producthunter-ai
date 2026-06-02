import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ConversionChartProps = {
  data: Array<Record<string, number | string>>;
};

export function ConversionChart({ data }: ConversionChartProps) {
  return (
    <div className="h-64 min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={256} initialDimension={{ width: 320, height: 256 }}>
        <AreaChart data={data} margin={{ left: -18, right: 12, top: 12, bottom: 0 }}>
          <defs>
            <linearGradient id="conversionFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#62e6ff" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#62e6ff" stopOpacity={0.03} />
            </linearGradient>
          </defs>
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
            contentStyle={{
              background: "rgba(16,20,27,0.96)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Area
            type="monotone"
            dataKey="conversion"
            stroke="#62e6ff"
            strokeWidth={3}
            fill="url(#conversionFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
