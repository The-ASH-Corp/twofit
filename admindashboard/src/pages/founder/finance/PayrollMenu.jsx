import { selectPayroll } from "@/redux/features/payroll/payroll.selector";
import { createPayroll, getPayroll } from "@/redux/features/payroll/payroll.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";

const PayrollMenu = ({ setPayrollOpen, payrollOpen }) => {
  const dispatch = useDispatch();

  // toggle states (logic only, no UI change)
  const [toggles, setToggles] = useState({
    rating: false,
    extraClient: false,
    extendProgram: false,
    target: false,
  });
  const [initialized, setInitialized] = useState(false);


  // backend payload
  const [payrollData, setPayrollData] = useState({
    rating1: 0,
    rating2: 0,
    rating3: 0,
    extraClient: 0,
    extendProgram30days: 0,
    extendProgram60days: 0,
    extendProgram90days: 0,
    targetAchieved: 0,
  });

  useEffect(() => {
      dispatch(getPayroll());
    }, [dispatch]);

  const data = useAppSelector(selectPayroll);
  useEffect(() => {
    if (!initialized && data && Object.keys(data).length > 0) {
      setPayrollData({
        rating1: data.rating1 ?? 0,
        rating2: data.rating2 ?? 0,
        rating3: data.rating3 ?? 0,
        extraClient: data.extraClient ?? 0,
        extendProgram30days: data.extendProgram30days ?? 0,
        extendProgram60days: data.extendProgram60days ?? 0,
        extendProgram90days: data.extendProgram90days ?? 0,
        targetAchieved: data.targetAchieved ?? 0,
      });

      setToggles({
        rating:
          (data.rating1 ?? 0) > 0 ||
          (data.rating2 ?? 0) > 0 ||
          (data.rating3 ?? 0) > 0,
        extraClient: (data.extraClient ?? 0) > 0,
        extendProgram:
          (data.extendProgram30days ?? 0) > 0 ||
          (data.extendProgram60days ?? 0) > 0 ||
          (data.extendProgram90days ?? 0) > 0,
        target: (data.targetAchieved ?? 0) > 0,
      });

      setInitialized(true);
    }
  }, [data, initialized]);


//   useEffect(() => {
//     if (data ) {
//       setPayrollData(data[0]);
//     }
//   }, [data]);

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setPayrollData((prev) => ({
      ...prev,
      [key]: Number(value) || 0,
    }));
  };

  const handelSubmit = () => {
    dispatch(createPayroll(payrollData));
    setPayrollOpen(!payrollOpen);
  };

  return (
    <div className="absolute z-20 w-76 flex flex-col items-center gap-10 bg-white rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] right-1 top-1">
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
              checked={toggles.rating}
              onChange={() => handleToggle("rating")}
            />
            <div className="relative w-7 h-4 bg-gray-300 rounded-full peer-checked:bg-[#0A4F48] transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-3" />
            <p className="text-[12px]">Rating Incentives</p>
          </label>

          {toggles.rating && (
            <div className="flex flex-col items-start gap-2 w-full">
              <p className="text-[11px]">Rating</p>

              {[
                {
                  label: "4.0 – 4.4",
                  key: "rating1",
                  value: payrollData.rating1,
                },
                {
                  label: "4.5 – 4.7",
                  key: "rating2",
                  value: payrollData.rating2,
                },
                {
                  label: "4.8 – 5.0",
                  key: "rating3",
                  value: payrollData.rating3,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between w-full gap-2"
                >
                  <span className="p-3 bg-[#F8F8F8] rounded-xl text-[11px]">
                    {item.label}
                  </span>
                  <input
                    placeholder="Enter Amount"
                    type="text"
                    value={item.value === 0 ? "" : item.value}
                    className="outline-none border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-fit"
                    onChange={(e) => handleChange(item.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* section 2 */}
        <div className="flex flex-col items-start gap-4 w-full">
          <label className="relative inline-flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={toggles.extraClient}
              onChange={() => handleToggle("extraClient")}
            />
            <div className="relative w-7 h-4 bg-gray-300 rounded-full peer-checked:bg-[#0A4F48] transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-3" />
            <p className="text-[12px]">Expert Takes Extra Clients</p>
          </label>

          {toggles.extraClient && (
            <div className="flex flex-col items-start gap-2 w-full">
              <p className="text-[11px]">Per Client</p>
              <input
                placeholder="Enter Amount"
                type="text"
                value={
                  payrollData.extraClient === 0 ? "" : payrollData.extraClient
                }
                className="outline-none border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
                onChange={(e) => handleChange("extraClient", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* section 3 */}
        <div className="flex flex-col items-start gap-4 w-full">
          <label className="relative inline-flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={toggles.extendProgram}
              onChange={() => handleToggle("extendProgram")}
            />
            <div className="relative w-7 h-4 bg-gray-300 rounded-full peer-checked:bg-[#0A4F48] transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-3" />
            <p className="text-[12px]">Client Extends Program</p>
          </label>

          {toggles.extendProgram && (
            <div className="flex flex-col items-center gap-4 w-full">
              {[
                {
                  label: "30 Days",
                  key: "extendProgram30days",
                  value: payrollData.extendProgram30days,
                },
                {
                  label: "60 Days",
                  key: "extendProgram60days",
                  value: payrollData.extendProgram60days,
                },
                {
                  label: "90 Days",
                  key: "extendProgram90days",
                  value: payrollData.extendProgram90days,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between w-full gap-2"
                >
                  <span className="p-3 bg-[#F8F8F8] rounded-xl text-[11px]">
                    {item.label}
                  </span>
                  <input
                    placeholder="Enter Amount"
                    type="text"
                    value={item.value === 0 ? "" : item.value}
                    className="outline-none border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-fit"
                    onChange={(e) => handleChange(item.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* section 4 */}
        <div className="flex flex-col items-start gap-4 w-full">
          <label className="relative inline-flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={toggles.target}
              onChange={() => handleToggle("target")}
            />
            <div className="relative w-7 h-4 bg-gray-300 rounded-full peer-checked:bg-[#0A4F48] transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform after:duration-300 peer-checked:after:translate-x-3" />
            <p className="text-[12px]">Client Target Achieved</p>
          </label>

          {toggles.target && (
            <div className="flex flex-col items-start gap-2 w-full">
              <p className="text-[11px]">Amount</p>
              <input
                placeholder="Enter Amount"
                type="text"
                value={
                  payrollData.targetAchieved === 0
                    ? ""
                    : payrollData.targetAchieved
                }
                className="outline-none border border-[#DBDEDD] rounded-xl py-1.5 px-2 w-full"
                onChange={(e) => handleChange("targetAchieved", e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* button */}
      <div className="flex flex-col items-start gap-4 w-full">
        <p className="text-[11px] text-[#66706D]">
          All incentives apply only to Experts.
        </p>
        <button
          onClick={handelSubmit}
          className="bg-[#0A4F48] w-full rounded-lg py-2.5 text-white font-semibold"
        >
          Save & Update
        </button>
      </div>
    </div>
  );
};

export default PayrollMenu;
