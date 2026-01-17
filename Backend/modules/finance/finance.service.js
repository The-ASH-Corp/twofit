import { AdminModel } from "../admin/admin.model.js";
import { CoachModel } from "../coach/coach.model.js";
import { HeadsModel } from "../Heads/heads.modal.js";


export const allEmployees = async (page, limit) => {
  const heads = await HeadsModel.find({}, "_id name salary email role").lean();
  const admins = await AdminModel.find({}, "_id name salary email role").lean();
  const experts = await CoachModel.find(
    {},
    "_id name salary email role incentives"
  ).lean();

  const unifiedData = [
    ...heads.map((h) => ({
      ...h,
      role: "head",
      netSalary: h.salary,
      incentives: "N/A",
    })),
    ...admins.map((a) => ({
      ...a,
      role: "admin",
      netSalary: a.salary,
      incentives: "N/A",
    })),
    ...experts.map((c) => ({
      ...c,
      role: "expert",
      netSalary: Number(c.salary || 0) + Number(c.incentives || 0),
    })),
  ];

  const skip = (page - 1) * limit;
  const employees = unifiedData.slice(skip, skip + limit);
  const totalSalary = unifiedData.reduce(
    (sum, emp) => sum + Number(emp.netSalary),
    0
  );
  console.log(unifiedData)
  return {
    employeeCount: unifiedData.length,
    totalSalary,
    employees,
  };
};