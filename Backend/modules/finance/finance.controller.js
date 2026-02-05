import * as financeService from "./finance.service.js"

export const employees = async (req, res) => {
  try {
    const { page, limit } = req.params;
    const employ = await financeService.allEmployees(page, limit);
    res.status(200).json({
      success: true,
      data: employ,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};