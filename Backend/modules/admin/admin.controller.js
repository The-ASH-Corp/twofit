import * as service from "./admin.services.js";

export const getAllAdmins = async (req, res) => {
  try {
    const {page,limit}=req.params
    const admins = await service.getAllAdmins(page,limit);
    res.status(201).json({
      success: true,
      data: admins,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
