import * as service from "./admin.services.js";

export const getAllAdmins = async (req, res) => {
  try {
    const { page, limit } = req.params
    const {updated,totalCount} = await service.getAllAdmins(page, limit);
    res.status(201).json({
      success: true,
      data: updated,
      total: totalCount,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const addAdmin = async (req, res) => {
  try {
    const admin = await service.addNewAdmin(req.body)
    res.status(201).json({ success: true, data: admin })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}
export const getAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await service.getAdminById(id);
    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export const getAllCoachesByAdmin = async (req, res) => {
  try {
    const { adminId, page, limit } = req.params;
    const result = await service.getAllCoachesByAdmin({
      adminId,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    res.status(200).json({
      success: true,
      data: result.coaches,
      total: result.totalCount,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const getDashboardData = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { duration } = req.query; // Get duration from query params
    const result = await service.getDashboardData(adminId, duration);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAdminByHead =async(req,res)=>{
  try {
    const {headId,page,limit} = req.params;
    const {admin,totalCount} = await service.getAdminByHead({headId,page,limit});
    res.status(200).json({
      success: true,
      data: admin,
      total: totalCount,
    });
  } catch (error) {
    res.status(400).json({success:false,message:error.message})   
  }
}

export const getFounderAdminList = async (req, res) => {
  try {
    const { page, limit } = req.params;

    const list = await service.founderAdminList(page, limit);

    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await service.deleteAdmin(id);
    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const editAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await service.editAdmin(id, req.body);
    res.status(200).json({
      success: true,
      data: admin,
      message: "Admin updated successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAdminByProgram = async (req, res) => {
  try {
    const { programId, page, limit } = req.params;
    const { data, totalCount } = await service.getAdminByProgram({ programId, page, limit });
    res.status(200).json({
      success: true,
      data: data,
      total: totalCount,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}