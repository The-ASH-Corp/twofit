import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { weeklyCompliance } from "@/assets/weeklyCompliance";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { selectSelectedClient } from "@/redux/features/client/client.selectors";

const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function clampPercent(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(Math.max(numeric, 0), 100);
}

function getDateFromComplianceEntry(item) {
  const candidate =
    item?.date ||
    item?.dayDate ||
    item?.createdAt ||
    item?.updatedAt ||
    null;

  if (!candidate) return null;
  const parsed = new Date(candidate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toComplianceSeries(weeklyData = [], graphDays = 14) {
  const sourceData = Array.isArray(weeklyData) && weeklyData.length > 0 ? weeklyData : [];

  if (sourceData.length === 0) return [];

  const entries = sourceData.map((item, index) => {
    const therapy = clampPercent(item?.therapy);
    const workout = clampPercent(item?.workout);
    const diet = clampPercent(item?.diet);

    return {
      index,
      item,
      dateObj: getDateFromComplianceEntry(item),
      value: Math.round((therapy + workout + diet) / 3),
    };
  });

  const hasDateEntries = entries.some((entry) => entry.dateObj);
  const orderedEntries = hasDateEntries
    ? [...entries].sort((a, b) => {
        if (a.dateObj && b.dateObj) return a.dateObj - b.dateObj;
        if (a.dateObj) return -1;
        if (b.dateObj) return 1;
        return a.index - b.index;
      })
    : entries;

  const safeGraphDays = Math.max(1, Math.min(Number(graphDays) || 14, 30));
  const recentEntries = orderedEntries.slice(-safeGraphDays);

  return recentEntries.map((entry, index) => {
    let dayLabel = null;
    if (typeof entry?.item?.day === "string" && entry.item.day.trim().length > 0) {
      const rawDay = entry.item.day.trim();
      const dayMatch = rawDay.match(/^day\s*(\d+)$/i);
      dayLabel = dayMatch ? `D${dayMatch[1]}` : rawDay.slice(0, 3);
    }

    return {
      label:
        entry.dateObj?.toLocaleDateString("en-US", { month: "short", day: "numeric" }) ||
        dayLabel ||
        WEEK[index] ||
        `D${index + 1}`,
      value: entry.value,
    };
  });
}

function toWeightSeries(weightHistory = []) {
  const sorted = (Array.isArray(weightHistory) ? [...weightHistory] : [])
    .map((entry) => {
      const weight = Number(entry?.weight);
      const dateObj = entry?.date ? new Date(entry.date) : null;
      return {
        weight,
        dateObj: dateObj && !Number.isNaN(dateObj.getTime()) ? dateObj : null,
      };
    })
    .filter((entry) => Number.isFinite(entry.weight) && entry.dateObj)
    .sort((a, b) => a.dateObj - b.dateObj);

  if (sorted.length === 0) return [];

  const firstWeight = sorted[0].weight;

  return sorted.map((point, index) => {
    const previousWeight = index > 0 ? sorted[index - 1].weight : point.weight;
    const difference = Number((point.weight - previousWeight).toFixed(1));
    const totalDifference = Number((point.weight - firstWeight).toFixed(1));

    return {
      label: point.dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Number(point.weight.toFixed(1)),
      difference,
      totalDifference,
    };
  });
}

function getWeightTicks(series = []) {
  const values = series
    .map((item) => Number(item?.value))
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) return [0];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const padding = Number((Math.max(range * 0.18, 0.5)).toFixed(1));
  const low = Number((min - padding).toFixed(1));
  const high = Number((max + padding).toFixed(1));
  const step = Number(((high - low) / 4).toFixed(1));

  return [0, 1, 2, 3, 4].map((i) => Number((low + (step * i)).toFixed(1)));
}

function TrendCard({
  title,
  data,
  yTicks,
  valueFormatter,
  allowYDecimals = false,
}) {
  const hasData = Array.isArray(data) && data.length > 0;
  const gradientId = `trend-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="client-card flex min-h-[176px] flex-col p-4 sm:p-[18px]">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="client-title text-[14px] sm:text-[15px]">{title}</h3>
      </div>

      <div className="relative h-[180px] w-full sm:h-[200px] lg:h-[224px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 14, left: -22, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0A4F48" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#0A4F48" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                axisLine={{ stroke: "#d7e0d8", strokeWidth: 1 }}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#7f8f84", fontWeight: 600 }}
                tickMargin={8}
                minTickGap={18}
              />
              <YAxis
                axisLine={{ stroke: "#d7e0d8", strokeWidth: 1 }}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#7f8f84", fontWeight: 600 }}
                tickMargin={6}
                width={48}
                domain={[Math.min(...yTicks), Math.max(...yTicks)]}
                ticks={yTicks}
                allowDecimals={allowYDecimals}
              />
              <Tooltip
                formatter={(value) =>
                  typeof valueFormatter === "function"
                    ? valueFormatter(value)
                    : value
                }
                contentStyle={{
                  borderRadius: "14px",
                  border: "1px solid #e8eee7",
                  boxShadow: "0 6px 18px rgba(42, 61, 49, 0.12)",
                  background: "rgba(255, 255, 255, 0.95)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#e6efec"
                strokeWidth={5}
                fill="none"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#0A4F48"
                strokeWidth={2.4}
                fill={`url(#${gradientId})`}
                dot={{
                  r: 3.8,
                  fill: "#0A4F48",
                  stroke: "white",
                  strokeWidth: 1.7,
                }}
                activeDot={{
                  r: 4.8,
                  fill: "#0A4F48",
                  stroke: "white",
                  strokeWidth: 2.3,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-[20px] bg-[#fbfdfb]/50 border border-dashed border-[#e4eae4] text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-[#0A4F48]/40">
              <ResponsiveContainer width={18} height={18}>
                <AreaChart data={[{v:0},{v:1},{v:0.5}]}>
                  <Area type="monotone" dataKey="v" stroke="currentColor" fill="none" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[13px] font-bold text-[#4a5a51]">No records yet</p>
            <p className="mt-0.5 text-[11px] font-medium text-[#93a198]">Start logging to see your trends</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardTrendCards({ complianceData }) {
  const user = useAppSelector(selectUser);
  const selectedClient = useAppSelector(selectSelectedClient);
  const complianceSeries = useMemo(
    () => toComplianceSeries(complianceData?.weeklyData, complianceData?.graphDays),
    [complianceData?.weeklyData, complianceData?.graphDays],
  );
  
  const effectiveWeightHistory = useMemo(() => {
    const storeWeightHistory = selectedClient?.weightHistory || user?.weightHistory || [];
    return Array.isArray(storeWeightHistory) ? storeWeightHistory : [];
  }, [selectedClient?.weightHistory, user?.weightHistory]);
  
  const weightSeries = useMemo(
    () => toWeightSeries(effectiveWeightHistory),
    [effectiveWeightHistory],
  );
  const weightTicks = useMemo(() => getWeightTicks(weightSeries), [weightSeries]);

  const complianceTicks = [0, 20, 40, 60, 80, 100];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <TrendCard 
        title="Compliance" 
        data={complianceSeries} 
        yTicks={complianceTicks} 
      />
      <TrendCard 
        title="Weight Progress" 
        data={weightSeries} 
        yTicks={weightTicks}
        allowYDecimals
      />
    </div>
  );
}