import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { data } from "../../../assets/weeklyCompliance";

export default function Measeurement() {
  return (
    <div className="bg-white rounded-xl  ">
      <ResponsiveContainer width="100%" height={265}>
        <BarChart data={data} barCategoryGap={10} barGap={2}>
          <XAxis dataKey="week" padding={{ left: 0, right: 0 }} />
          <YAxis
            domain={[0, "auto"]}
            width={35}
            // label={{  angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />

          <Bar dataKey="chest" fill="#0A4F48" radius={[4, 4, 0, 0]} />
          <Bar dataKey="waist" fill="#45C4A2" radius={[4, 4, 0, 0]} />
          <Bar dataKey="hips" fill="#94A3B8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
