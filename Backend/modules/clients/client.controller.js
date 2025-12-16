import * as service from "./client.services.js";

export const getAllClients = async (req, res) => {
  try {
    const clients = await service.getAllClient();
    res.status(201).json({
      success: true,
      data: clients,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getSingleClient = async (req, res) => {
  try {
    const client = await service.getSingleClient(req.params);
    res.status(200).json({
        success: true,
        data : client,
    })
  } catch (error) {
    res.status(400).json({ success: false, message: err.message });
  }
};
