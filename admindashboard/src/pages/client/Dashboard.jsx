import React, { useEffect, useState, useCallback } from "react";
import HeroCard from "./components/HeroCard";
import StatsGrid from "./components/StatsGrid";
import DietPlanCard from "./components/DietPlanCard";
import ExpertsList from "./components/ExpertsList";
import Measeurement from "./components/Measeurement";
import MobileBottomNav from "./components/MobileBottomNav";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useDispatch } from "react-redux";
import { getProgramById } from "@/redux/features/program/program.thunk";
import { getAllCoachesByAdmin } from "@/redux/features/coach/coach.thunk";
import {
  fetchClientComplianceStats,
  getClient,
} from "@/redux/features/client/client.thunk";
import { selectSelectedClient } from "@/redux/features/client/client.selectors";
import { SyncLoader } from "react-spinners";
import NotificationsList from "./components/NotificationsList";
import WaterIntake from "./components/WaterIntake";
import WeeklyCheckInModal from "./components/WeeklyCheckInModal.jsx";
import { submitWeeklyCheckIn } from "@/redux/features/client/client.thunk";
import { toast } from "react-toastify";
import DashboardTrendCards from "./components/DashboardTrendCards";
import ClientDetails from "./components/ClientDetails";

export default function Dashboard() {
  const [program, setProgram] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [compliance, setCompliance] = useState(0);
  const [complianceData, setComplianceData] = useState(null);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector(selectUser);
  const clientUser = useAppSelector(selectSelectedClient);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      dispatch(getClient({ id: user?._id }));
    }
  }, [user?._id, dispatch]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const programId =
        typeof user?.programType === "object"
          ? user?.programType?._id
          : user?.programType;

      if (!programId) {
        setIsLoading(false);
        return;
      }

      const [programRes, coachesRes, complianceRes] = await Promise.all([
        dispatch(getProgramById(programId)).unwrap(),
        dispatch(
          getAllCoachesByAdmin([
            user?.trainer,
            user?.therapist,
            user?.dietition,
          ]),
        ).unwrap(),
        dispatch(fetchClientComplianceStats({ id: user?._id, days: 14 })).unwrap(),
      ]);

      setProgram(programRes.data);
      setCoaches(coachesRes);
      setCompliance(complianceRes?.overall || 0);
      setComplianceData(complianceRes || null);
      setStreak(complianceRes?.streaks?.activeStreak || 0);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    dispatch,
    user?._id,
    user?.dietition,
    user?.programType,
    user?.therapist,
    user?.trainer,
  ]);

  useEffect(() => {
    if (user?._id && user?.programType) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, user?._id, user?.programType]);

  const currentGlobalDay =
    clientUser?.currentGlobalDay || user?.currentGlobalDay || 1;
  const currentWeek = Math.ceil(currentGlobalDay / 7);
  const isCheckInDay = currentGlobalDay % 7 === 0;

  useEffect(() => {
    if (isCheckInDay && clientUser) {
      const hasCheckedIn = clientUser.weeklyCheckIns?.some(
        (ci) => ci.weekIndex === currentWeek,
      );
      if (!hasCheckedIn) {
        setShowCheckInModal(true);
      }
    }
  }, [isCheckInDay, clientUser, currentWeek]);

  const handleWeeklyCheckInSubmit = async (weekIndex, responses) => {
    try {
      const result = await dispatch(
        submitWeeklyCheckIn({ weekIndex, responses }),
      );
      if (submitWeeklyCheckIn.fulfilled.match(result)) {
        toast.success("Assessment submitted successfully!");
        setShowCheckInModal(false);
        dispatch(getClient({ id: user?._id }));
      } else {
        toast.error(result.payload || "Failed to submit assessment");
      }
    } catch {
      toast.error("An error occurred during submission");
    }
  };

  const clientStatus = clientUser?.status || user?.status;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] sm:min-h-[60vh]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  }

  if (clientStatus === "Inactive") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[80vh] text-center p-6 sm:p-8 bg-white rounded-4xl shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-4">
          Account Inactive
        </h1>
        <p className="text-gray-600 text-base sm:text-lg font-medium max-w-md">
          Please contact your administrator to reactivate your account and
          continue your wellness journey.
        </p>
      </div>
    );
  }

  if (clientStatus === "Completed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[80vh] text-center p-6 sm:p-8 bg-[#0A4F48] rounded-4xl shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">
          Congratulations!
        </h1>
        <p className="text-[#A7F3D0] text-base sm:text-lg font-bold">
          You've successfully completed your program and achieved your goals!
        </p>
      </div>
    );
  }

  const statsData = {
    programDays: `${currentGlobalDay}/${program?.plan?.duration || 30}`,
    compliance: `${Math.round(compliance)}%`,
    currentWeight: clientUser?.currentWeight || user?.currentWeight || "--",
    activeStreak: streak,
  };

  const weightHistory = clientUser?.weightHistory || user?.weightHistory || [];

  return (
    <div className="client-dashboard-surface min-h-screen px-4 pb-32 sm:px-6 sm:pb-36 lg:px-8 lg:pb-8 xl:px-10 2xl:px-14">
      <div className="client-dashboard-shell">
        {/* Main Content */}
        <div className="client-dashboard-main">
          {/* Row 1: Hero & Hydration */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <HeroCard program={program} currentGlobalDay={currentGlobalDay} />
            <WaterIntake currentGlobalDay={currentGlobalDay} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
            <ClientDetails user={user} />
          </div>

          {/* Row 2: Stats Grid */}
          <StatsGrid statsData={statsData} />

          {/* Row 3: Trends/Charts */}
          <DashboardTrendCards
            complianceData={complianceData}
            weightHistory={weightHistory}
          />
        </div>

        {/* Sidebar */}
        <aside className="client-side-panel">
          <DietPlanCard
            dietPlanPdf={clientUser?.dietPlanPdf || user?.dietPlanPdf}
          />
          <ExpertsList expert={coaches} />
          <Measeurement />
          <NotificationsList />
        </aside>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {showCheckInModal && (
        <WeeklyCheckInModal
          weekIndex={currentWeek}
          onSubmit={handleWeeklyCheckInSubmit}
        />
      )}
    </div>
  );
}
