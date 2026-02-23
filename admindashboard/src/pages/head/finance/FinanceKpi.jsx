import KpiCard from '@/components/cards/KpiCard'
import { selectUser } from '@/redux/features/auth/auth.selectores';
import React from 'react'
import { useSelector } from 'react-redux';
import { BanknoteArrowDown, Banknote, BadgePercent } from "lucide-react";

export default function FinanceKpi() {
    const user = useSelector(selectUser);
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
          value="N/A"
          icon={
            <BadgePercent size={20} className="text-[#0A4F48] md:w-6 md:h-6" />
          }
          bg="#F4DBC7"
        />
        <KpiCard
          title="Net Salary"
          value={`₹ ${user?.salary?.toLocaleString("en-IN")}`}
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

