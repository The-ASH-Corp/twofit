import { AdminModel } from "../admin/admin.model.js";
import allProgramModel from "../allPrograms/allPrograma.model.js";
import User from "../auth/auth.model.js";
import { HeadsModel } from "../Heads/heads.modal.js";


export const getDashboardData = async() => {
    const totalClient = await User.countDocuments();
    const totalHeads = await HeadsModel.countDocuments();
    const totalAdmins = await AdminModel.countDocuments();
    const totalPrograms = await allProgramModel.countDocuments();

    return{
        totalClient,
        totalHeads,
        totalAdmins,
        totalPrograms,
    }
} 