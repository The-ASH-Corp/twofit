import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchClientMeasurementHistory } from "@/redux/features/client/client.thunk";

export default function Measeurement() {
  const dispatch = useDispatch();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    dispatch(fetchClientMeasurementHistory())
      .unwrap()
      .then((data) => {
        setHistory(data.measurementHistory || []);
      })
      .catch(console.error);
  }, [dispatch]);

  const stats = [
    { label: "Chest", before: "112 CM", current: "105 cm", progress: 85 },
    { label: "Waist", before: "68 CM", current: "55 cm", progress: 75 },
  ];

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-8 group transition-all duration-300 hover:shadow-lg">
      <h3 className="text-gray-400 font-black text-[15px] uppercase tracking-widest">
        Measurements
      </h3>

      <div className="space-y-10">
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

      <button className="w-full mt-2 border-2 border-[#0A4F48] text-[#0A4F48] py-3.5 rounded-full text-[13px] font-black uppercase tracking-widest hover:bg-[#0A4F48] hover:text-white transition-all active:scale-95 shadow-sm">
        Update All Metrics
      </button>
    </div>
  );
}


