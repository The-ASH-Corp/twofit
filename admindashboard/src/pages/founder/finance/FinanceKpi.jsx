import { assets } from "@/assets/asset";
import KpiCard from "@/components/cards/KpiCard";
import React, { useState } from "react";
import PayrollMenu from "./PayrollMenu";

export default function FinanceKpi({data}) {
  console.log(data)
  const [payrollOpen, setPayrollOpen] = useState(false);
  const totalSalary = data?.reduce(
    (sum, emp) => sum + Number(emp.salary || 0),
    0
  );

  return (
    <div className="relative flex flex-col items-center gap-4 w-full bg-white p-5 rounded-xl mb-4 h-[calc()]">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-[#0A4F48] font-bold text-[16px]">
          Salary & Incentives Overview
        </h2>
        <div className="flex items-center gap-2.5">
          <button className="text-[12px] font-semibold px-3.5 py-2.5 bg-[#EBF3F2] rounded-md">
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
      <div className="flex gap-4 justify-between  w-full">
        <KpiCard
          title="Total Employees"
          value={data?.length}
          icon={assets.totalEmploy}
          iconClass="bg-[#0A4F48]"
          bg="#0A4F48"
        />
        <KpiCard
          title="Total Payroll"
          value={`₹ ${totalSalary.toLocaleString("en-IN")}`}
          icon={assets.totalPayroll}
          iconClass="bg-[#F4DBC7]"
          bg="#F4DBC7"
        />
        <KpiCard
          title="Pending Payroll"
          value="₹ 1,200,300"
          icon={assets.pendingPayroll}
          iconClass="bg-[#0A4F48]"
          bg="#0A4F48"
        />
        <KpiCard
          title="Completed Payroll"
          value="250,000"
          icon={assets.totalPayroll}
          iconClass="bg-[#F4DBC7]"
          bg="#F4DBC7"
        />
      </div>
      {/* payroll menu */}
      {payrollOpen && (
        <PayrollMenu
          setPayrollOpen={setPayrollOpen}
          payrollOpen={payrollOpen}
        />
      )}
    </div>
  );
}
