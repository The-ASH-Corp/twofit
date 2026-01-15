import { AdminModel } from "../admin/admin.model.js";
import { CoachModel } from "../coach/coach.model.js";
import { HeadsModel } from "../Heads/heads.modal.js";


export const allEmployees = async (page, limit) => {
  const heads = await HeadsModel.find({}, "_id name salary email role").lean();
  const admins = await AdminModel.find({}, "_id name salary email role").lean();
  const experts = await CoachModel.find(
    {},
    "_id name salary email role"
  ).lean();

  const unifiedData = [
    ...heads.map((h) => ({ ...h, role: "head" })),
    ...admins.map((a) => ({ ...a, role: "admin" })),
    ...experts.map((c) => ({ ...c, role: "expert" })),
  ];

  const skip = (page - 1) * limit;
  const employees = unifiedData.slice(skip, skip + limit);
  const totalSalary = unifiedData.reduce(
    (sum, emp) => sum + Number(emp.salary || 0),
    0
  );

  return {
    employeeCount: unifiedData.length,
    totalSalary,
    employees,
  };
};