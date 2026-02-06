import { AdminModel } from "../admin/admin.model.js";
import { CoachModel } from "../coach/coach.model.js";
import { HeadsModel } from "../Heads/heads.modal.js";


export const allEmployees = async (page, limit) => {
  const heads = await HeadsModel.find({}, "_id name salary email role status").lean();
  const admins = await AdminModel.find(
    {},
    "_id name salary email role status",
  ).lean();
  const experts = await CoachModel.find(
    {},
    "_id name salary email role status incentives",
  ).lean();

  const unifiedData = [
    ...heads.map((h) => ({
      ...h,
      role: "Head",
      netSalary: h.salary,
      incentives: "N/A",
    })),
    ...admins.map((a) => ({
      ...a,
      role: "Admin",
      netSalary: a.salary,
      incentives: "N/A",
    })),
    ...experts.map((c) => ({
      ...c,
      role: "Expert",
      incentives:`₹ ${c.incentives.toLocaleString("en-IN")}`,
      netSalary: Number(c.salary || 0) + Number(c.incentives || 0),
    })),
  ];

  page = Number(page);
  limit = Number(limit);
  const skip = (page - 1) * limit;
  
  const employees = unifiedData.slice(skip, skip + limit);
  const totalSalary = unifiedData.reduce(
    (sum, emp) => sum + Number(emp.netSalary),
    0,
  );
  const totalBaseSalary = unifiedData.reduce(
    (sum, emp) => sum + Number(emp.salary),
    0,
  );
  const totalIncentive = experts.reduce((sum, emp) => sum + emp.incentives, 0);

  return {
    employeeCount: unifiedData.length,
    totalSalary,
    employees,
    totalIncentive,
    totalBaseSalary,
  };
};