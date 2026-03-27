import React, { useEffect, useState, useCallback, useMemo } from "react";
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

export default function Dashboard() {
  const [program, setProgram] = useState(null);
  const [coaches, setCoaches] = useState([]);
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

      const [programRes, coachesRes] = await Promise.all([
        dispatch(getProgramById(programId)).unwrap(),
        dispatch(
          getAllCoachesByAdmin([
            user?.trainer,
            user?.therapist,
            user?.dietition,
          ]),
        ).unwrap(),
        dispatch(fetchClientComplianceStats()).unwrap(),
      ]);
      setProgram(programRes.data);
      setCoaches(coachesRes);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    dispatch,
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
      <div className="flex justify-center items-center h-[60vh]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  }

  if (clientStatus === "Inactive") {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8 bg-white rounded-[32px] shadow-sm">
        <h1 className="text-3xl font-black text-gray-800 mb-4">
          Account Inactive
        </h1>
        <p className="text-gray-600 text-lg font-medium max-w-md">
          Please contact your administrator to reactivate your account and continue your wellness journey.
        </p>
      </div>
    );
  }

  if (clientStatus === "Completed") {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8 bg-[#0A4F48] rounded-[32px] shadow-xl">
        <h1 className="text-3xl font-black text-white mb-4 tracking-tight">
          Congratulations!
        </h1>
        <p className="text-[#A7F3D0] text-lg font-bold">
          You've successfully completed your program and achieved your goals!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto lg:p-8 p-4 pb-32 bg-[#F8FAFA] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 items-start">
        
        {/* Main Column */}
        <div className="flex flex-col gap-10">
          <HeroCard program={program} />
          <StatsGrid />
          <WaterIntake />
          
          {/* Mobile Only: Sidebars stack below main content */}
          <div className="lg:hidden flex flex-col gap-10">
             <DietPlanCard
               dietPlanPdf={clientUser?.dietPlanPdf || user?.dietPlanPdf}
             />
             <ExpertsList expert={coaches} />
             <Measeurement />
             <NotificationsList />
          </div>
        </div>

        {/* Sidebar Column (Desktop Only) */}
        <div className="hidden lg:flex flex-col gap-10">
          <DietPlanCard
            dietPlanPdf={clientUser?.dietPlanPdf || user?.dietPlanPdf}
          />
          <ExpertsList expert={coaches} />
          <Measeurement />
          <NotificationsList />
        </div>
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

