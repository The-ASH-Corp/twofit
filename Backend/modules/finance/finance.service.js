import { AdjustmentModel } from "../adjustment/adjustment.model.js";
import { AdminModel } from "../admin/admin.model.js";
import { CoachModel } from "../coach/coach.model.js";
import { HeadsModel } from "../Heads/heads.modal.js";
import { calculateCoachIncentives } from "../incentive/incentive.service.js";
import { PayrollModel } from "./finance.model.js";

export const allEmployees = async (page, limit) => {
  const now = new Date();

  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const heads = await HeadsModel.find(
    { status: "Active" },
    "_id name salary  role status",
  ).lean();

  const admins = await AdminModel.find(
    { status: "Active" },
    "_id name salary  role status",
  ).lean();

  const experts = await CoachModel.find(
    { status: "Active" },
    "_id name salary  role status incentives",
  ).lean();

  // ✅ Get current month adjustments
  const adjustments = await AdjustmentModel.find({
    month: currentMonth,
    year: currentYear,
  }).lean();

  // ✅ New Employees Payroll Style Data
  const payrollEmployees = [
    ...heads.map((h) => ({
      ...h,
      role: "Head",
      incentives: 0,
    })),

    ...admins.map((a) => ({
      ...a,
      role: "Admin",
      incentives: 0,
    })),

    ...experts.map((c) => ({
      ...c,
      incentives: Number(c.incentives || 0),
    })),
  ];

  const formattedEmployees = payrollEmployees.map((emp) => {
    const employeeAdjustments = adjustments.filter(
      (adj) =>
        adj.employeeId?.toString() === emp._id.toString() ||
        adj.scope === "ALL",
    );

    const bonus = employeeAdjustments
      .filter((a) => a.type === "BONUS")
      .reduce((sum, a) => sum + Number(a.amount || 0), 0);

    const deduction = employeeAdjustments
      .filter((a) => a.type === "DEDUCTION")
      .reduce((sum, a) => sum + Number(a.amount || 0), 0);

    const baseSalary = Number(emp.salary || 0);

    const incentive = Number(emp.incentives || 0);

    const netSalary = baseSalary + incentive + bonus - deduction;



    return {
      employeeName: emp.name,
      role: emp.role,
      baseSalary,
      incentive,
      bonus,
      deduction,
      netSalary,
      month: now.toLocaleString("en-IN", {
        month: "long",
      }),
      year: currentYear,
    };
  });

  // ✅ Pagination
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const employees = formattedEmployees.slice(skip, skip + limit);

  // ✅ Recalculate totals
  const totalSalary = formattedEmployees.reduce(
    (sum, emp) => sum + emp.netSalary,
    0,
  );

  const totalBaseSalary = formattedEmployees.reduce(
    (sum, emp) => sum + emp.baseSalary,
    0,
  );

  const totalIncentive = formattedEmployees.reduce(
    (sum, emp) => sum + emp.incentive,
    0,
  );

  const totalBonus = formattedEmployees.reduce(
    (sum, emp) => sum + emp.bonus,
    0,
  );

  const totalDeduction = formattedEmployees.reduce(
    (sum, emp) => sum + emp.deduction,
    0,
  );

  return {
    employeeCount: formattedEmployees.length,

    totalSalary,

    employees,

    allEmployeesList: payrollEmployees,

    totalIncentive,

    totalDeduction,

    totalBonus,

    totalBaseSalary,
  };
};




export const generateMonthlyPayroll = async () => {
  try {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const alreadyGenerated = await PayrollModel.exists({ month, year });
    if (alreadyGenerated) return;

    const heads = await HeadsModel.find({ status: "Active" }).lean();
    const admins = await AdminModel.find({ status: "Active" }).lean();
    const coaches = await CoachModel.find({ status: "Active" }).lean();

    const adjustments = await AdjustmentModel.find({ month, year }).lean();

    const allEmployees = [
      ...heads.map((h) => ({ ...h, type: "Head" })),
      ...admins.map((a) => ({ ...a, type: "Admin" })),
      ...coaches.map((c) => ({ ...c, type: "Coach" })),
    ];

    for (let emp of allEmployees) {
      let incentive = emp.incentives || 0;

      // ✅ Coach incentives (fresh)
      if (emp.type === "Coach") {
        const result = await calculateCoachIncentives(emp._id);
        incentive = result?.totalIncentive || 0;
      }

      // ✅ Get adjustments
      const individual = adjustments.filter(
        (a) => a.employeeId?.toString() === emp._id.toString(),
      );

      const global = adjustments.filter((a) => a.scope === "ALL");

      const allAdj = [...individual, ...global];

      const bonus = allAdj
        .filter((a) => a.type === "BONUS")
        .reduce((sum, a) => sum + a.amount, 0);

      const deduction = allAdj
        .filter((a) => a.type === "DEDUCTION")
        .reduce((sum, a) => sum + a.amount, 0);

      const baseSalary = emp.salary || 0;
      const netSalary = baseSalary + incentive + bonus - deduction;

      await PayrollModel.create({
        employeeId: emp._id,
        employeeType: emp.type,
        month,
        year,
        baseSalary,
        incentive,
        bonus,
        deduction,
        netSalary,
      });
    }

    return "Payroll generated successfully";
  } catch (error) {
    throw error;
  }
};


export const getPayrollHistoryById = async (employeeId, page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;
    const totalCount = await PayrollModel.countDocuments({ employeeId });
    const history = await PayrollModel.find({ employeeId })
      .sort({ year: -1, month: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedData = history.map((item) => ({
      ...item,
      monthYear: new Date(item.year, item.month - 1).toLocaleString("en-IN", {
        month: "short",
        year: "numeric",
      }),
    }));
     return {
       totalCount,
       data: formattedData,
     };
  } catch (error) {
    throw error;
  }
};


