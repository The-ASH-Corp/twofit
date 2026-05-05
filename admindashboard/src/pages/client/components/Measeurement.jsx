import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchClientMeasurementHistory } from "@/redux/features/client/client.thunk";

export default function Measeurement() {
  const dispatch = useDispatch();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchClientMeasurementHistory())
      .unwrap()
      .then((data) => {
        setHistory(data.measurementHistory || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [dispatch]);

  const first = history[0] || {};
  const last = history[history.length - 1] || {};
  const toSafeNumber = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };

  const formatMeasurement = (value) => {
    const numeric = toSafeNumber(value);
    return numeric === null ? "--" : numeric;
  };

  const resolveProgress = (start, end, fallback) => {
    if (start > 0 && end > 0) {
      return Math.min(Math.max(Math.round((end / start) * 100), 8), 98);
    }
    return fallback;
  };

  const stats = [
    {
      label: "Chest",
      start: toSafeNumber(first.chest),
      current: toSafeNumber(last.chest),
      progress: resolveProgress(toSafeNumber(first.chest), toSafeNumber(last.chest), 46),
    },
    {
      label: "Waist",
      start: toSafeNumber(first.waist),
      current: toSafeNumber(last.waist),
      progress: resolveProgress(toSafeNumber(first.waist), toSafeNumber(last.waist), 78),
    },
    {
      label: "Hips",
      start: toSafeNumber(first.hip),
      current: toSafeNumber(last.hip),
      progress: resolveProgress(toSafeNumber(first.hip), toSafeNumber(last.hip), 68),
    },
  ];

  return (
    <section className="mt-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="client-title text-[14px]">Measurements</h3>
      </div>

      <div className="space-y-3.5">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="client-title text-[13px] font-medium text-[#2d3748]">{stat.label}</p>
              <div className="flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap bg-white px-2.5 py-0.5 rounded-full shadow-sm border border-[#e2e8f0]">
                <span className="text-[#0A4F48] font-bold">{formatMeasurement(stat.current)} cm</span>
                <span className="text-[#a0aec0] text-[9px] uppercase tracking-wider">vs</span>
                <span className="text-[#718096]">{formatMeasurement(stat.start)} cm</span>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="relative h-2.5 flex-1 overflow-visible rounded-full border border-[#e5ece5] bg-[#f8fbf8]">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-[#0A4F48]/55 transition-all duration-1000"
                  style={{ width: `${stat.progress}%` }}
                />
                <div
                  className="absolute top-1/2 flex h-[18px] w-[18px] -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(10,79,72,0.2)] bg-[#0A4F48] shadow-[0_3px_9px_rgba(10,79,72,0.28)] transition-all duration-1000"
                  style={{ left: `calc(${stat.progress}% - 9px)` }}
                >
                  <div className="h-1 w-1 rounded-full bg-white opacity-75" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-medium text-[#8ca094]">
              <span>Start: {formatMeasurement(stat.start)} cm</span>
              <span>Current: {formatMeasurement(stat.current)} cm</span>
            </div>
          </div>
        ))}
        {loading && <div className="h-0.5" />}
      </div>
    </section>
  );
}
