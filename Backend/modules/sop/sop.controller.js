import * as sopService from "./sop.service.js";
import mongoose from "mongoose";

/* ===============================
   1️⃣ Assign SOP
================================= */
export const assignSOP = async (req, res) => {
  try {
    const data = await sopService.assignSOP(req.body);

    res.status(201).json({
      success: true,
      message: "SOP assigned successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ===============================
   2️⃣ Update SOP
================================= */
export const updateSOP = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await sopService.updateSOP(id, req.body);

    res.status(200).json({
      success: true,
      message: "SOP updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ===============================
   3️⃣ Deactivate SOP
================================= */
export const deactivateSOP = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await sopService.deactivateSOP(id);

    res.status(200).json({
      success: true,
      message: "SOP deactivated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ===============================
   4️⃣ Coach Get Today Tasks
================================= */
export const getTodaySOP = async (req, res) => {
  try {
    const tasks = await sopService.getTodaySOP(req.params.id);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ===============================
   5️⃣ Complete SOP
================================= */
export const completeSOP = async (req, res) => {
  try {
    const { sopId } = req.params;
    const coachId = req.user._id;

    const result = await sopService.completeSOP(sopId, coachId);

    res.status(200).json({
      success: true,
      message: "Task marked as completed",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ===============================
   6️⃣ Admin View Completion History
================================= */
export const getSOPHistory = async (req, res) => {
  try {
    const { coachId, month, year } = req.params;

    const history = await sopService.getSOPHistory(
      coachId,
      parseInt(month),
      parseInt(year),
    );

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
 
export const getSOPById = async (req, res) => {
  try {
    const sop = await sopService.getSOPById(req.params.id)
    res.status(200).json({
      success: true,
      data: sop,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}