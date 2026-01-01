import { generatePassword, hashPassword } from "../../utils/password.js";
import { AdminModel } from "./admin.model.js";

export const getAllAdmins = async (page, limit) => {
  const skip = (page - 1) * limit;

  const admins = await AdminModel.find().skip(skip).limit(limit).select("-password");
  return admins;
};


export const addNewAdmin = async (adminData)=>{

  if(adminData.password){
    adminData.password =await hashPassword(adminData.password);
  }else{
    const password = generatePassword();
    console.log(password);
    adminData.password= await hashPassword(password);
  }
  
  const newAdmin =await AdminModel.create({
    name:adminData.fullname,
    email:adminData.email,
    phone:adminData.phone,
    address:adminData.address,
    password:adminData.password,
    dob:adminData.dob,
    gender:adminData.gender,
    specialization:adminData.specialization,
    program:adminData.chooseProgram,
    salary:adminData.baseSalary,
    autoSendWelcome:adminData.autoSendWelcome,
    autoSendGuide:adminData.autoSendGuide,
    automatedReminder:adminData.automatedReminder,
  })
  return newAdmin
}  