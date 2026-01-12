import { assets } from "@/assets/asset";
import React, { useState } from "react";
import ProgressChart from "../components/ProgressChart";
import WeightChart from "../components/Measeurement";
import WeightUpdate from "./WeightUpdate";
import MeasurementUpdate from "./MeasurementUpdate";
import { Download, X } from "lucide-react";
import { Bar } from "react-chartjs-2";

export default function Progress() {
  const [isOpen, setIsOpen] = useState(false);
  const [panelType, setPanelType] = useState(null);

  const kpiData = [
    {
      title: "Program Days",
      value: "12 / 60",
      icon: assets.website,
      bg: "#0A4F48",
      iconColor: true,
    },
    {
      title: "Weight Progress",
      value: "75 kg",
      icon: assets.website,
      bg: "#F4DBC7",
      iconColor: false,
    },
    {
      title: "Overall Compliance",
      value: "75%",
      icon: assets.website,
      bg: "#0A4F48",
      iconColor: true,
    },
    {
      title: "Active Streak",
      value: "12 Days",
      icon: assets.website,
      bg: "#F4DBC7",
      iconColor: false,
    },
  ];

  const compliance = [
    {
      title: "Diet",
      missed: "Missed Diet: 26",
      percentage: "82%",
      color: "#0A4F48",
    },
    {
      title: "Workout",
      missed: "Missed Workout: 29",
      percentage: "75%",
      color: "#F4DBC7",
    },
    {
      title: "Therapy",
      missed: "Missed Therapy: 16",
      percentage: "68%",
      color: "#EBF3F2",
    },
  ];

  const measurementsData = {
    labels: ["W 1", "W 2", "W 3", "W 4"],
    datasets: [
      {
        label: "Chest",
        data: [96, 94, 92, 95],
        backgroundColor: "#F4DBC7",
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
        barThickness:18,
      },
      {
        label: "Waist",
        data: [85, 82, 80, 78],
        backgroundColor: "#E8F5F3",
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
        barThickness: 18,
      },
      {
        label: "Hips",
        data: [105, 102, 100, 98],
        backgroundColor: "#0A4F48",
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
        barThickness: 18,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "start",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: { size: 12, weight: "500" },
          color: "#66706D",
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#fff",
        titleColor: "#0A4F48",
        titleFont: { size: 13, weight: "600" },
        bodyColor: "#66706D",
        bodyFont: { size: 12, weight: "500" },
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 16,
        boxPadding: 6,
        usePointStyle: true,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].dataset.label;
          },
          label: (context) => {
            return "";
          },
          afterBody: (tooltipItems) => {
            const current = tooltipItems[0].parsed.y;
            const start = 120; // You can make this dynamic based on your data
            const change = current - start;
            return [
              `Current         ${current} cm`,
              `Start              ${start} cm`,
              `Change          ${change} cm`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: { display: false },
        ticks: {
          font: { size: 12, weight: "500" },
          color: "#9CA3AF",
          padding: 8,
        },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        max: 160,
        ticks: {
          stepSize: 40,
          font: { size: 11, weight: "500" },
          color: "#9CA3AF",
          callback: (value) => value + " cm",
        },
        grid: {
          color: "#F3F4F6",
          drawBorder: false,
        },
      },
    },
  };
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#0A4F48] font-bold text-[20px]">
          Overall Progress
        </h1>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition-colors">
            Hold Plan
          </button>
          <button className="bg-[#0A4F48] text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#083d38] transition-colors">
            Extend Plan
          </button>
          <button className="bg-[#0A4F48] text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#083d38] transition-colors flex items-center gap-2">
            <span>PDF</span>
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_350px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            {kpiData.map((kpi, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm"
              >
                <div>
                  <p className="text-[12px] text-gray-500 font-medium mb-1">
                    {kpi.title}
                  </p>
                  <h2 className="text-[22px] font-bold text-[#0A4F48] leading-tight">
                    {kpi.value}
                  </h2>
                </div>
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ backgroundColor: kpi.bg }}
                >
                  <img
                    src={kpi.icon}
                    alt={kpi.title}
                    className="w-5 h-5"
                    style={{
                      filter: kpi.iconColor
                        ? "brightness(0) invert(1)"
                        : "none",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-6">
            {/* Weight Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#0A4F48] font-bold text-[15px]">
                  Weight Progress
                </h3>
                <button
                  className="bg-[#0A4F48] text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#083d38] transition-colors"
                  onClick={() => {
                    setIsOpen(true);
                    setPanelType("weight");
                  }}
                >
                  Update
                </button>
              </div>
              <ProgressChart />
            </div>

            {/* Measurements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#0A4F48] font-bold text-[15px]">
                  Measurements
                </h3>
                <button
                  className="bg-[#0A4F48] text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#083d38] transition-colors"
                  onClick={() => {
                    setIsOpen(true);
                    setPanelType("measurement");
                  }}
                >
                  Update
                </button>
              </div>
              <div className="h-[280px] w-full">
                <Bar data={measurementsData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Streaks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-[#0A4F48] font-bold text-[16px] mb-4">
              Streaks
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                <p className="text-[13px] font-medium text-gray-700">
                  Active Streak
                </p>
                <p className="text-[#0A4F48] font-bold text-[15px]">12 Days</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                <p className="text-[13px] font-medium text-gray-700">
                  Longest Streak
                </p>
                <p className="font-bold text-[15px] text-gray-800">16 Days</p>
              </div>
            </div>
          </div>

          {/* Compliance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#0A4F48] font-bold text-[16px]">
                Compliance
              </h3>
              <span className="text-[18px] font-bold text-gray-800">78%</span>
            </div>
            <div className="space-y-3">
              {compliance.map((item, i) => (
                <div
                  key={i}
                  className="relative bg-gray-50 rounded-xl p-4 pl-5"
                >
                  <div
                    className="absolute left-0 top-0 w-1.5 h-full rounded-l-xl"
                    style={{ background: item.color }}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-gray-700">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-gray-400 font-medium">
                        {item.missed}
                      </span>
                      <span className="text-[13px] font-bold text-[#0A4F48]">
                        {item.percentage}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Update Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/5 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-[400px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
              <h2 className="font-bold text-[18px] text-[#0A4F48]">
                {panelType === "weight"
                  ? "Update Weight"
                  : "Update Measurements"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {panelType === "weight" && <WeightUpdate />}
              {panelType === "measurement" && <MeasurementUpdate />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
