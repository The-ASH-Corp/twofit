import React, { useEffect, useState } from "react";
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
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useDispatch } from "react-redux";
import { getProgramById } from "@/redux/features/program/program.thunk";
import { getAllCoachesByAdmin } from "@/redux/features/coach/coach.thunk";

export default function Dashboard() {
  const [program, setProgram] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const user = useAppSelector(selectUser);
  const dispatch = useDispatch();
  const fetchDashboardData = async () => {
    const program = await dispatch(getProgramById(user?.programType)).unwrap();
    const coaches = await dispatch(getAllCoachesByAdmin([user?.trainer,user?.therapist,user?.dietition])).unwrap();
    setProgram(program);
    setCoaches(coaches);
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full grid grid-cols-[1fr_350px] gap-8 p-2">
      {/* Main Content Area */}
      <div className="space-y-8">
        {/* Top Section: Hero and KPI Cards */}
        <div className="grid grid-cols-[1.5fr_1fr] gap-6">
          <HeroCard program={program} />
          <div className="grid grid-cols-2 gap-4">
            <KpiCard
              title="Program Days"
              value={`${program?.programDays || 0}/ ${program?.plan.duration || 0}`}
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
              value={user?.currentWeight || 0}
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
          <TaskList plans={program?.plan} />
        </div>
      </div>

      {/* Right Sidebar Area */}
      <div className="space-y-4">
        <DietPlanCard />
        <ExpertsList expert={coaches}/>
        <Measeurement />
        <NotificationsList />
      </div>
    </div>
  );
}