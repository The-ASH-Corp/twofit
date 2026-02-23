import { assets } from '@/assets/asset'
import KpiCard from '@/components/cards/KpiCard'
import { selectUser } from '@/redux/features/auth/auth.selectores';
import { refreshProfile } from '@/redux/features/auth/auth.thunk';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BanknoteArrowDown, Banknote, BadgePercent } from "lucide-react";

export default function FinanceKpi() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  useEffect(() => {
    dispatch(refreshProfile({ id: user?._id, role: user?.role }));
  }, [dispatch, user?._id, user?.role]);
  const netSalary = user?.salary + user?.incentives;
  return (
    <div className=" bg-white p-5 rounded-xl mb-4 space-y-4">
      <h2 className="text-[#0A4F48] font-bold text-[16px]">Salary Overview</h2>

      <div className="flex flex-col md:flex-row gap-4 justify-between  ">
        <KpiCard
          title="Base Salary"
          value={`₹ ${user?.salary?.toLocaleString("en-IN")}`}
          icon={<Banknote size={20} className="text-[#ffffff] md:w-6 md:h-6" />}
          bg="#0A4F48"
        />
        <KpiCard
          title="Total Incentives"
          value={`₹ ${user?.incentives?.toLocaleString("en-IN")}`}
          icon={
            <BadgePercent size={20} className="text-[#0A4F48] md:w-6 md:h-6" />
          }
          bg="#F4DBC7"
        />
        <KpiCard
          title="Net Salary"
          value={`₹ ${netSalary?.toLocaleString("en-IN")}`}
          icon={
            <BanknoteArrowDown
              size={20}
              className="text-[#ffffff] md:w-6 md:h-6"
            />
          }
          bg="#0A4F48"
        />
      </div>
    </div>
  );
}
