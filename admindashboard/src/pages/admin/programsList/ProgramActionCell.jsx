import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProgramActionCell({ row }) {
  const navigate = useNavigate();
  const { _id, title, plans = [], plan, isAssignedToAdmin } = row.original;
  const hasPlans = Boolean(plan) || plans.length > 0;

  const handleNavigation = () => {
    if (hasPlans) {
      navigate("/admin/programs/plans", {
        state: { programId: _id, title },
      });
      return;
    }

    navigate("/admin/programs/create", {
      state: { programId: _id, title },
    });
  };

  if (!hasPlans && !isAssignedToAdmin) {
    return null;
  }

  return (
    <button
      onClick={handleNavigation}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg ${
        hasPlans ? "bg-[#EBF3F2] text-[#0A4F48]" : "bg-[#0A4F48] text-white"
      } transition-colors`}
    >
      {hasPlans ? "View Plan" : "Add Plan"}
    </button>
  );
}
