import { success } from "zod";
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

export const getPayrollHistory = async (req, res)=> {
try {
  const { page, limit, id } = req.params;
  const history = await financeService.getPayrollHistoryById(id, page, limit);
  res.status(200).json({
    success: true,
    data: history
  })
} catch (error) {
  res.status(400).json({ success: false, message: error.message });
}
}

// finance.controller.js

export const allPayrollHistory = async (req, res) => {
  try {
    const { page, limit } = req.params;
    const { month, year } = req.query;

    const history = await financeService.getAllPayrollHistory(
      page,
      limit,
      month,
      year,
    );

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};