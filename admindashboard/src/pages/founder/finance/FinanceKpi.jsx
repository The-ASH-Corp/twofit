import KpiCard from "@/components/cards/KpiCard";
import React, { useState } from "react";
import IncentiveMenu from "./IncentiveMenu";
import { useAppSelector } from "@/redux/store/hooks";
import {
  IdCardLanyard,
  Banknote,
  BadgePercent,
  BanknoteArrowUp,
  CirclePlus,
  BanknoteArrowDown,
} from "lucide-react";
import {
  selectAllEmployeesList,
  selectEmployeeCount,
  selectTotalBaseSalary,
  selectTotalBonus,
  selectTotalDeduction,
  selectTotalIncentive,
  selectTotalSalary,
} from "@/redux/features/finance/finance.selector";
import PayrollMenu from "./PayrollMenu";

export default function FinanceKpi() {
  const [payrollOpen, setPayrollOpen] = useState(false);
  const [incentiveOpen, setIncentiveOpen] = useState(false);
  const EmployeeList = useAppSelector(selectAllEmployeesList);
  const count = useAppSelector(selectEmployeeCount);
  const totalPayroll = useAppSelector(selectTotalSalary);
  const totalBaseSalary = useAppSelector(selectTotalBaseSalary);
  const totalIncentive = useAppSelector(selectTotalIncentive);
  const totalBonus = useAppSelector(selectTotalBonus);
  const totalDeduction = useAppSelector(selectTotalDeduction);


  return (
    <div className="relative  w-full bg-white p-5 rounded-xl mb-4 h-[calc()]">
      <div className="flex flex-col items-center gap-8 md:gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center md:justify-between w-full">
          <h2 className="text-[#0A4F48] font-bold text-[16px]">
            Salary Overview
          </h2>
          <div className="flex md:justify-end items-center gap-2.5 w-full md:w-fit">
            <button
              className="text-[12px] font-semibold px-3.5 py-2.5 bg-[#EBF3F2] rounded-md text-black"
              onClick={() => setIncentiveOpen(!incentiveOpen)}
            >
              Incentives
            </button>
            <button
              className="text-[12px] font-semibold px-3.5 py-2.5 bg-[#0A4F48] rounded-md text-white"
              onClick={() => setPayrollOpen(!payrollOpen)}
            >
              Create Payroll
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4  w-full">
          <KpiCard
            title="Total Employees"
            value={count}
            icon={
              <IdCardLanyard
                size={20}
                className="text-[#ffffff] md:w-6 md:h-6"
              />
            }
            iconClass="bg-[#0A4F48]"
            bg="#0A4F48"
          />
          <KpiCard
            title="Total Incentive"
            value={`₹ ${totalIncentive?.toLocaleString("en-IN")}`}
            icon={
              <BadgePercent
                size={20}
                className="text-[#0A4F48] md:w-6 md:h-6"
              />
            }
            iconClass="bg-[#F4DBC7]"
            bg="#F4DBC7"
          />
          <KpiCard
            title="Total Bonus"
            value={`₹ ${totalBonus?.toLocaleString("en-IN")}`}
            icon={
              <CirclePlus size={20} className="text-[#0A4F48] md:w-6 md:h-6" />
            }
            iconClass="bg-[#F4DBC7]"
            bg="#F4DBC7"
          />
          <KpiCard
            title="Total Deduction"
            value={`₹ ${totalDeduction?.toLocaleString("en-IN")}`}
            icon={
              <BanknoteArrowDown
                size={20}
                className="text-[#0A4F48] md:w-6 md:h-6"
              />
            }
            iconClass="bg-[#F4DBC7]"
            bg="#F4DBC7"
          />
          <KpiCard
            title="Total Base Salary"
            value={`₹ ${totalBaseSalary?.toLocaleString("en-IN")}`}
            icon={
              <Banknote size={20} className="text-[#ffffff] md:w-6 md:h-6" />
            }
            iconClass="bg-[#0A4F48]"
            bg="#0A4F48"
          />
          <KpiCard
            title="Total Payroll"
            value={`₹ ${totalPayroll?.toLocaleString("en-IN")}`}
            icon={
              <BanknoteArrowUp
                size={20}
                className="text-[#0A4F48] md:w-6 md:h-6"
              />
            }
            iconClass="bg-[#F4DBC7]"
            bg="#F4DBC7"
          />
        </div>
        {/* payroll menu */}
        {incentiveOpen && (
          <IncentiveMenu
            setIncentiveOpen={setIncentiveOpen}
            incentiveOpen={incentiveOpen}
          />
        )}
        {payrollOpen && (
          <PayrollMenu
            EmployeeList={EmployeeList}
            setPayrollOpen={setPayrollOpen}
            payrollOpen={payrollOpen}
          />
        )}
      </div>
    </div>
  );
}
