import * as headService from "./heads.service.js";

export const createHead = async (req, res) => {
  try {
    const head = await headService.createHead(req.body);
    res.status(201).json({
      success: true,
      message: "Head created successfully",
      data: head,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllHeads = async (req, res) => {
  try {
    const { page, limit } = req.params;
    const heads = await headService.getAllHeads(page, limit);
    res.status(201).json({
      success: true,
      data: heads,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getHeadById = async (req, res) => {
  try {
    const head = await headService.getHeadById(req.params.id);
    res.status(200).json({
      success: true,
      data: head,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateHead = async (req, res) => {
  try {
    const head = await headService.updateHead(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: head,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteHead = async (req, res) => {
  try {
    const head = await headService.deleteHead(req.params.id);
    res.status(200).json({
      success: true,
      date: head
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const head = await headService.getDashboardData();
    res.status(200).json({
      success: true,
      data: head,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};