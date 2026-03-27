import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDispatch } from "react-redux";
import { fetchClientWeightHistory } from "@/redux/features/client/client.thunk";
  
export default function ProgressChart() {
  const dispatch = useDispatch();

  const [weight, setWeight] = useState([]);

  useEffect(() => {
    dispatch(fetchClientWeightHistory())
      .unwrap()
      .then((data) => {
        setWeight(data.weightHistory);
      })
      .catch((err) => {
        console.error("Failed to load weight history", err);
      });
  }, [dispatch]);

  const startWeight = weight.length > 0 ? weight[0].weight : 0;
  const currentWeight = weight.length > 0 ? weight[weight.length - 1].weight : 0;
  const weightChange = currentWeight - startWeight;
  const numericWeights = weight
    .map((entry) => Number(entry?.weight))
    .filter((entry) => Number.isFinite(entry));

  const minWeight = numericWeights.length ? Math.min(...numericWeights) : 0;
  const maxWeight = numericWeights.length ? Math.max(...numericWeights) : 0;
  const yPadding = Math.max(1, Math.ceil((maxWeight - minWeight) * 0.2));

  return (
    <div className="h-[260px] w-full mt-6 pb-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={weight} margin={{ top: 10, right: 10, left: 0, bottom: 26 }}>
          <CartesianGrid vertical={false} stroke="#E6EFEC" strokeDasharray="3 3" />
          
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 900, fontFamily: 'sans-serif', letterSpacing: '0.05em' }}
            dy={8}
            minTickGap={16}
            tickFormatter={(value) => value || ''}
          />
          <YAxis
            domain={[
              () => minWeight - yPadding,
              () => maxWeight + yPadding,
            ]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }}
            width={40}
          />

          <Tooltip 
            cursor={{ stroke: '#F8FAFA', strokeWidth: 20 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const val = payload[0].value;
                return (
                  <div className="bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-[16px] border border-gray-50 flex flex-col gap-1.5 min-w-[120px]">
                    <div className="flex justify-between gap-4 text-[10px] uppercase tracking-widest font-black">
                       <span className="text-gray-400">{payload[0]?.payload?.date || 'Date'}</span>
                       <span className="text-gray-800">{val} kg</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          <Line
            type="linear"
            dataKey="weight"
            stroke="#0A4F48"
            strokeWidth={3}
            dot={{ r: 4, fill: '#0A4F48', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#0A4F48', stroke: '#E6FFFA', strokeWidth: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
