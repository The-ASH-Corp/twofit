import { assets } from "@/assets/asset";
import KpiCard from "@/components/cards/KpiCard";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function FinanceKpi() {
  const [payrollOpen, setPayrollOpen] = useState(false);
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
          title="Total Experts"
          value="150"
          icon={assets.website}
          iconClass="bg-[#0A4F48]"
        />
        <KpiCard
          title="Total Monthly Salary"
          value="12,300,000"
          icon={assets.website}
          iconClass="bg-[#F4DBC7]"
        />
        <KpiCard
          title="Total Incentives"
          value="1,200,300"
          icon={assets.chats}
          iconClass="bg-[#0A4F48]"
        />
        <KpiCard
          title="Average Expert Rating"
          value="$250,000"
          icon={assets.filter}
          iconClass="bg-[#F4DBC7]"
        />
      </div>
      {/* payroll menu */}
      {payrollOpen && (
        <div className="absolute z-20 w-76 flex flex-col items-center gap-10  bg-white rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] right-1 top-1 ">
          {/* header */}
          <div className="flex justify-between items-center w-full">
            <h2 className="text-[16px] font-bold text-[#0A4F48]">Incentives</h2>
            <button onClick={() => setPayrollOpen(!payrollOpen)}>
              <IoMdClose />
            </button>
          </div>
          {/* form */}
          <div className="flex flex-col items-center gap-8 w-full">
            {/* section 1 */}
            <div className="flex flex-col items-start gap-4 w-full">
              <label className="relative inline-flex items-center cursor-pointer gap-2">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  // checked={isActive}
                  // onChange={onToggle}
                />
                <div className="relative w-7 h-4 bg-gray-300 rounded-full peer-focus:outline-none peer-checked:bg-[#0A4F48] transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-3"></div>
                <p className="text-[12px]">Rating Incentives</p>
              </label>
              <div className="flex flex-col items-start gap-2 w-full">
                <p className="text-[11px]">Rating</p>
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="p-3 bg-[#F8F8F8] rounded-xl text-[11px]">
                      4.0 – 4.4
                    </span>
                    <input
                      placeholder="Enter  Amount"
                      type="text"
                      className="outline-none border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-fit"
                    />
                  </div>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="p-3 bg-[#F8F8F8] rounded-xl text-[11px]">
                      4.5 – 4.7
                    </span>
                    <input
                      placeholder="Enter  Amount"
                      type="text"
                      className="outline-none border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-fit"
                    />
                  </div>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="p-3 bg-[#F8F8F8] rounded-xl text-[11px]">
                      4.8 – 5.0
                    </span>
                    <input
                      placeholder="Enter  Amount"
                      type="text"
                      className="outline-none border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-fit"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* section 2 */}
            <div className="flex flex-col items-start gap-4 w-full">
              <label className="relative inline-flex items-center cursor-pointer gap-2">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  // checked={isActive}
                  // onChange={onToggle}
                />
                <div className="relative w-7 h-4 bg-gray-300 rounded-full peer-focus:outline-none peer-checked:bg-[#0A4F48] transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-3"></div>
                <p className="text-[12px]">Expert Takes Extra Clients</p>
              </label>
              <div className="flex flex-col items-start gap-2 w-full">
                <p className="text-[11px]">Per Client</p>
                <input
                  placeholder="Enter  Amount"
                  type="text"
                  className="outline-none border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
                />
              </div>
            </div>
            {/* section 3 */}
            <div className="flex flex-col items-start gap-4 w-full">
              <label className="relative inline-flex items-center cursor-pointer gap-2">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  // checked={isActive}
                  // onChange={onToggle}
                />
                <div className="relative w-7 h-4 bg-gray-300 rounded-full peer-focus:outline-none peer-checked:bg-[#0A4F48] transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-3"></div>
                <p className="text-[12px]">Client Extends Program</p>
              </label>
              <div className="flex flex-col items-start gap-2 w-full">
                <p className="text-[11px]">Per Duration</p>
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="p-3 bg-[#F8F8F8] rounded-xl text-[11px]">
                      30 Days
                    </span>
                    <input
                      placeholder="Enter  Amount"
                      type="text"
                      className="outline-none border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-fit"
                    />
                  </div>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="p-3 bg-[#F8F8F8] rounded-xl text-[11px]">
                      60 Days
                    </span>
                    <input
                      placeholder="Enter  Amount"
                      type="text"
                      className="outline-none border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-fit"
                    />
                  </div>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="p-3 bg-[#F8F8F8] rounded-xl text-[11px]">
                      90 Days
                    </span>
                    <input
                      placeholder="Enter  Amount"
                      type="text"
                      className="outline-none border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-fit"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* section 4 */}
            <div className="flex flex-col items-start gap-4 w-full">
              <label className="relative inline-flex items-center cursor-pointer gap-2">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  // checked={isActive}
                  // onChange={onToggle}
                />
                <div className="relative w-7 h-4 bg-gray-300 rounded-full peer-focus:outline-none peer-checked:bg-[#0A4F48] transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-3"></div>
                <p className="text-[12px]">Client Target Achieved</p>
              </label>
              <div className="flex flex-col items-start gap-2 w-full">
                <p className="text-[11px]">Amount</p>
                <input
                  placeholder="Enter  Amount"
                  type="text"
                  className="outline-none border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
                />
              </div>
            </div>
          </div>
          {/* button */}
          <div className="flex flex-col items-start gap-4 w-full">
            <p className="text-[11px] text-[#66706D]">
              All incentives apply only to Experts.
            </p>
            <button className="bg-[#0A4F48] w-full rounded-lg py-2.5 text-white font-semibold">
              Save & Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
