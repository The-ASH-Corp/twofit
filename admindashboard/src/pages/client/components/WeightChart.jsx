import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {data} from '../../../assets/weeklyCompliance';

export default function WeightChart() {
  

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="week" />
          <YAxis label={{ value: "cm", angle: -90, position: "insideLeft" }} />
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
