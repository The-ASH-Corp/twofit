import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { weightProgress } from "@/assets/weeklyCompliance";

export default function ProgressChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={weightProgress}>
        <CartesianGrid horizontal={true} vertical={false} />

        <XAxis dataKey="date" />
        <YAxis
          domain={[0, 120]}
          ticks={[0, 30, 60, 90, 120]}
          axisLine={false}
          tickFormatter={(v) => `${v} kg`}
        />

        <Tooltip formatter={(v) => `${v} kg`} />

        <Line
          type="monotone"
          dataKey="weight"
          stroke="#0A4F48"
          strokeWidth={3}
          // dot={{ r: 4 }}
          // activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
