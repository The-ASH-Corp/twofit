import * as planService from "./plan.service.js";

export const createNewPlan = async (req, res) => {
  try {
    const plan = await planService.createPlan(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "Plan created successfully",
        data: plan,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSinglePlanById = async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await planService.getPlanById(planId);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Plan fetched successfully",
        data: plan,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
