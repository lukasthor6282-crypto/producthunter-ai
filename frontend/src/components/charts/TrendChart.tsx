import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type TrendChartProps = {
  data: Array<Record<string, number | string>>;
  xKey?: string;
  yKey?: string;
};

export function TrendChart({ data, xKey = "niche_label", yKey = "trend_score" }: TrendChartProps) {
  const formatLabel = (value: string) => (value.length > 9 ? `${value.slice(0, 8)}.` : value);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: -20, right: 12, top: 12, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#65f0b7" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#65f0b7" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "#9aa4b2", fontSize: 11, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            tickMargin={12}
            tickFormatter={(value) => formatLabel(String(value))}
          />
          <YAxis tick={{ fill: "#9aa4b2", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(16,20,27,0.94)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
          <Area
            type="monotone"
            dataKey={yKey}
            stroke="#65f0b7"
            strokeWidth={3}
            fill="url(#trendFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
