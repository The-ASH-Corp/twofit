import React, { useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { createPayroll } from "@/redux/features/finance/finance.thunk";

const PayrollMenu = ({ EmployeeList, setPayrollOpen, payrollOpen }) => {
  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      employeeId: "",
      employeeType: "",
      type: "",
      amount: "",
      reason: "",
      scope: "INDIVIDUAL",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },

    onSubmit: async (values) => {
      try {
        setLoading(true);

        let payload = { ...values };

        // ✅ remove fields for ALL employees
        if (values.scope === "ALL") {
          delete payload.employeeId;
          delete payload.employeeType;
        }

        console.log(payload);

        await dispatch(createPayroll(payload)).unwrap();

        toast.success("Payroll created successfully");

        setPayrollOpen(false);
        window.location.reload();
      } catch (error) {
        toast.error(error || "Failed to create payroll");
      } finally {
        setLoading(false);
      }
    },
  });

  // ✅ Check if ALL employees selected
  const isAllEmployees = formik.values.scope === "ALL";

  // ✅ Filter employees based on selected role
  const filteredEmployees = useMemo(() => {
    if (!formik.values.employeeType) return EmployeeList;

    return EmployeeList?.filter(
      (emp) => emp.role === formik.values.employeeType,
    );
  }, [EmployeeList, formik.values.employeeType]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="absolute z-20 w-full md:w-76 flex flex-col items-center gap-10 bg-white rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] md:right-1 top-1"
    >
      {/* header */}
      <div className="flex justify-between items-center w-full">
        <h2 className="text-[16px] font-bold text-[#0A4F48]">Create Payroll</h2>

        <button type="button" onClick={() => setPayrollOpen(!payrollOpen)}>
          <IoMdClose />
        </button>
      </div>

      {/* form */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Scope */}
        <div className="flex flex-col items-start gap-2 w-full">
          <p className="text-[12px]">Scope</p>

          <select
            name="scope"
            value={formik.values.scope}
            onChange={(e) => {
              formik.handleChange(e);

              if (e.target.value === "ALL") {
                formik.setFieldValue("employeeId", "");
                formik.setFieldValue("employeeType", "");
              }
            }}
            className="border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="ALL">All Employees</option>
          </select>
        </div>

        {/* Role */}
        <div className="flex flex-col items-start gap-2 w-full">
          <p className="text-[12px]">Role</p>

          <select
            name="employeeType"
            value={formik.values.employeeType}
            onChange={(e) => {
              formik.handleChange(e);

              // reset employee when role changes
              formik.setFieldValue("employeeId", "");
            }}
            disabled={isAllEmployees}
            className={`border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full ${
              isAllEmployees ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Select</option>

            <option value="Head">Head</option>
            <option value="Admin">Admin</option>
            <option value="Trainer">Trainer</option>
            <option value="Dietician">Dietician</option>
            <option value="Therapist">Therapist</option>
          </select>
        </div>

        {/* Employee */}
        <div className="flex flex-col items-start gap-2 w-full">
          <p className="text-[12px]">Select Employee</p>

          <select
            name="employeeId"
            value={formik.values.employeeId}
            onChange={(e) => {
              const selectedId = e.target.value;

              formik.setFieldValue("employeeId", selectedId);

              const selectedEmployee = EmployeeList.find(
                (emp) => emp._id === selectedId,
              );

              // auto set role
              if (selectedEmployee) {
                formik.setFieldValue("employeeType", selectedEmployee.role);
              }
            }}
            disabled={isAllEmployees}
            className={`border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full ${
              isAllEmployees ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Select</option>

            {filteredEmployees?.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="flex flex-col items-start gap-2 w-full">
          <p className="text-[12px]">Type</p>

          <select
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            className="border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
          >
            <option value="">Select</option>
            <option value="BONUS">Bonus</option>
            <option value="DEDUCTION">Deduction</option>
          </select>
        </div>

        {/* Amount */}
        <div className="flex flex-col items-start gap-2 w-full">
          <p className="text-[12px]">Amount</p>

          <input
            type="number"
            name="amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
            placeholder="Enter Amount"
            className="border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col items-start gap-2 w-full">
          <p className="text-[12px]">Notes</p>

          <input
            type="text"
            name="reason"
            value={formik.values.reason}
            onChange={formik.handleChange}
            placeholder="Enter Notes"
            className="border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
          />
        </div>

        {/* Month */}
        <div className="flex flex-col items-start gap-2 w-full">
          <p className="text-[12px]">Month</p>

          <select
            name="month"
            value={formik.values.month}
            onChange={formik.handleChange}
            className="border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="flex flex-col items-start gap-2 w-full">
          <p className="text-[12px]">Year</p>

          <input
            type="number"
            name="year"
            value={formik.values.year}
            onChange={formik.handleChange}
            placeholder="Enter Year"
            className="border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
          />
        </div>
      </div>

      {/* footer */}
      <div className="w-full flex flex-col gap-3">
        <button
          type="submit"
          className="w-full rounded-lg py-2.5 text-white font-semibold bg-[#0A4F48]"
        >
          {loading ? (
            <div className="flex justify-center items-center ">
              <SyncLoader color="#0A4F48" loading margin={10} size={17} />
            </div>
          ) : (
            <p>Complete Payroll</p>
          )}
        </button>
      </div>
    </form>
  );
};

export default PayrollMenu;
