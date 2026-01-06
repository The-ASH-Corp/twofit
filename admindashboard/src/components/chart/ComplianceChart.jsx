import { weeklyCompliance } from "@/assets/weeklyCompliance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import LegendHeader from "./LegendHeader";

export default function ComplianceChart() {

    
  return (
    <div>
    <LegendHeader/>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={weeklyCompliance} stackOffset="expand"    >
        <CartesianGrid horizontal={true} vertical={false}/>
        <XAxis dataKey="day" />
        <YAxis
          tickFormatter={(value) => `${Math.round(value * 100)}%`}
          domain={[0, 1]}
          axisLine={false}
        />
        <Tooltip formatter={(value) => `${Math.round(value * 100)}%`} />
        {/* <Legend /> */}



        {/* Stack bars */}
        <Bar
          dataKey="therapy"
          stackId="a"
          fill="#0A4F48"
          radius={[10, 10, 10, 10]}
        //    stroke="#ffffff"
        //   strokeWidth={5}
                       
         
        />

        <Bar
          dataKey="workout"
          stackId="a"
          fill="#F4DBC7"
          radius={[10, 10, 10, 10]}
           stroke="#ffffff"
          strokeWidth={3}
       
        />
        <Bar
          dataKey="diet"
          stackId="a"
          fill="#EBF3F2"
          radius={[10, 10, 10, 10]}
           stroke="#ffffff"
          strokeWidth={3}
        />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}
