import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchClientMeasurementHistory } from "@/redux/features/client/client.thunk";
import { useNavigate } from "react-router-dom";

export default function Measeurement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const stats = [
    {
      label: "Chest",
      before: first.chest != null ? `${first.chest} CM` : "—",
      current: last.chest != null ? `${last.chest} CM` : "—",
      progress: first.chest > 0 ? Math.min(Math.round((last.chest / first.chest) * 100), 100) : 0,
    },
    {
      label: "Waist",
      before: first.waist != null ? `${first.waist} CM` : "—",
      current: last.waist != null ? `${last.waist} CM` : "—",
      progress: first.waist > 0 ? Math.min(Math.round((last.waist / first.waist) * 100), 100) : 0,
    },
    {
      label: "Hips",
      before: first.hip != null ? `${first.hip} CM` : "—",
      current: last.hip != null ? `${last.hip} CM` : "—",
      progress: first.hip > 0 ? Math.min(Math.round((last.hip / first.hip) * 100), 100) : 0,
    },
  ];

  return (
    <div className="bg-white p-5 sm:p-6 md:p-8 rounded-3xl md:rounded-4xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-6 sm:gap-7 md:gap-8 group transition-all duration-300 hover:shadow-lg">
      <h3 className="text-gray-400 font-black text-[15px] uppercase tracking-widest">
        Measurements
      </h3>

      {loading ? (
        <div className="space-y-7 sm:space-y-8 md:space-y-10 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                </div>
                <div className="h-7 w-20 bg-gray-100 rounded-full" />
              </div>
              <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-7 sm:space-y-8 md:space-y-10">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[17px] font-black text-gray-800 leading-none">
                    {stat.label}
                  </p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    BEFORE: {stat.before}
                  </p>
                </div>
                <div className="bg-[#E6FFFA] px-4 py-1.5 rounded-full shadow-sm">
                  <p className="text-[12px] font-black text-[#0A4F48] leading-none">
                    {stat.current}
                  </p>
                </div>
              </div>

              <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0A4F48] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="w-full mt-2 border-2 border-[#0A4F48] text-[#0A4F48] py-3.5 rounded-full text-[13px] font-black uppercase tracking-widest hover:bg-[#0A4F48] hover:text-white transition-all active:scale-95 shadow-sm"
        onClick={() => navigate("/client/progress")}
      >
        Update All Metrics
      </button>
    </div>
  );
}


