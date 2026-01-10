import React from "react";
import { assets } from "@/assets/asset";
import KpiCard from "@/components/cards/KpiCard";
import HeroCard from "./components/HeroCard";
import ComplianceChart from "@/components/chart/ComplianceChart";
import ProgressChart from "./components/ProgressChart";
import TaskList from "./components/TaskList";
import DietPlanCard from "./components/DietPlanCard";
import ExpertsList from "./components/ExpertsList";
import Measeurement from "./components/Measeurement";
import NotificationsList from "./components/NotificationsList";

export default function Dashboard() {
  return (
    <div className="w-full grid grid-cols-[1fr_350px] gap-8 p-2">
      {/* Main Content Area */}
      <div className="space-y-8">
        {/* Top Section: Hero and KPI Cards */}
        <div className="grid grid-cols-[1.5fr_1fr] gap-6">
          <HeroCard />
          <div className="grid grid-cols-2 gap-4">
            <KpiCard
              title="Program Days"
              value="12 / 60"
              icon={assets.website}
              bg="#0A4F48"
              iconColor="white"
            />
            <KpiCard
              title="Overall Compliance"
              value="75%"
              icon={assets.website}
              bg="#0A4F48"
              iconColor="white"
            />
            <KpiCard
              title="Weight Progress"
              value="75 kg"
              icon={assets.website}
              bg="#F4DBC7"
            />
            <KpiCard
              title="Active Streak"
              value="12 Days"
              icon={assets.website}
              bg="#F4DBC7"
            />
          </div>
        </div>

        {/* Middle Section: Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-[#0A4F48] font-bold text-sm mb-4">
              Last Week Compliance
            </h2>
            <ComplianceChart />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-[#0A4F48] font-bold text-sm mb-4">
              Weight Progress
            </h2>
            <ProgressChart />
          </div>
        </div>

        {/* Bottom Section: My Tasks */}
        <div>
          <h2 className="text-[#0A4F48] font-bold text-lg">My Tasks</h2>
          <TaskList />
        </div>
      </div>

      {/* Right Sidebar Area */}
      <div className="space-y-4">
        <DietPlanCard />
        <ExpertsList />
        <Measeurement />
        <NotificationsList />
      </div>
    </div>
  );
}
