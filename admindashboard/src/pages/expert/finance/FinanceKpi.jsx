import { assets } from '@/assets/asset'
import KpiCard from '@/components/cards/KpiCard'
import { selectUser } from '@/redux/features/auth/auth.selectores';
import React from 'react'
import { useSelector } from 'react-redux';

export default function FinanceKpi() {
  const user = useSelector(selectUser);
  const netSalary = user?.salary + user?.incentives;
  return (
    <div className=" bg-white p-5 rounded-xl mb-4 space-y-4">
      <h2 className="text-[#0A4F48] font-bold text-[16px]">Salary Overview</h2>

      <div className="flex flex-col md:flex-row gap-4 justify-between  ">
        <KpiCard
          title="Base Salary"
          value={`₹ ${user?.salary?.toLocaleString("en-IN")}`}
          icon={assets.totalEmploy}
          bg="#0A4F48"
        />
        <KpiCard
          title="Total Incentives"
          value={`₹ ${user?.incentives?.toLocaleString("en-IN")}`}
          icon={assets.totalPayroll}
          bg="#F4DBC7"
        />
        <KpiCard
          title="Net Salary"
          value={`₹ ${netSalary?.toLocaleString("en-IN")}`}
          icon={assets.pendingPayroll}
          bg="#0A4F48"
        />
      </div>
    </div>
  );
}
