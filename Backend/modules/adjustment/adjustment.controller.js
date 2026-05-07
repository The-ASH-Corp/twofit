import * as service from "./adjustment.services.js";

export const createAdjustment = async (req, res) => {
  try {
    const data = await service.createAdjustment(req.body);

    res.status(200).json({
      success: true,
      message: "Adjustment added",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAdjustments = async (req, res) => {
  try {
    const { month, year } = req.params;

    const data = await service.getAdjustments(month, year);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
