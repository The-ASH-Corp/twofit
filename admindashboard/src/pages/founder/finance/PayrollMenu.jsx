import React from 'react'
import { IoMdClose } from 'react-icons/io';

const PayrollMenu = ({ setPayrollOpen, payrollOpen }) => {
  return (
    <div className="absolute z-20 w-full md:w-76 flex flex-col items-center gap-10 bg-white rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] md:right-1 top-1">
      {/* header */}
      <div className="flex justify-between items-center w-full">
        <h2 className="text-[16px] font-bold text-[#0A4F48]">Create Payroll</h2>
        <button onClick={() => setPayrollOpen(!payrollOpen)}>
          <IoMdClose />
        </button>
      </div>

      {/* form */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* SECTION 1 */}
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="relative inline-flex items-center cursor-pointer gap-2">
            <p className="text-[12px]">Employee</p>
          </label>

          <input
            type="text"
            placeholder="Enter Amount"
            className="border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
          />
        </div>

        {/* SECTION 2 */}
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="relative inline-flex items-center cursor-pointer gap-2">
            <p className="text-[12px]">Role</p>
          </label>

          <input
            type="text"
            placeholder="Enter Amount"
            className="border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
          />
        </div>

        {/* SECTION 3 */}
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="relative inline-flex items-center cursor-pointer gap-2">
            <p className="text-[12px]">Incentive Amount </p>
          </label>

          <input
            type="text"
            placeholder="Enter Amount"
            className="border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
          />
        </div>

        {/* SECTION 4 */}

        <div className="flex flex-col items-start gap-2 w-full">
          <label className="relative inline-flex items-center cursor-pointer gap-2">
            <p className="text-[12px]">Deduction</p>
          </label>

          <input
            type="text"
            placeholder="Enter Amount"
            className="border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
          />
        </div>

        {/* SECTION 5 */}
        <div className="flex flex-col items-start gap-2 w-full">
          <label className="relative inline-flex items-center cursor-pointer gap-2">
            <p className="text-[12px]">Notes</p>
          </label>

          <input
            type="text"
            placeholder="Enter Amount"
            className="border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
          />
        </div>
      </div>

      {/* footer */}
      <div className="w-full flex flex-col gap-3">
        <button
          className={`w-full rounded-lg py-2.5 text-white font-semibold "bg-gray-100 cursor-not-allowed bg-[#0A4F48]
          `}
        >
          <p>Complete Payroll</p>
        </button>
      </div>
    </div>
  );
};

export default PayrollMenu