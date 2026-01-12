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
    const result = await service.getDashboardData(adminId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};