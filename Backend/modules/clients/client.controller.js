import * as service from "./client.services.js";

export const getAllClients = async (req, res) => {
  try {
    const { page, limit } = req.params
    const { clients, totalCount } = await service.getAllClient(page, limit);
    res.status(200).json({
      success: true,
      data: clients,
      totalCount
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getSingleClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await service.getSingleClient(id);
    res.status(200).json({
      success: true,
      data: client,
    })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const updateClient = async (req, res) => {
  try {
    const { id } = req.params
    const updatedClient = await service.updateOneClient(req.body, id)
    res.status(200).json({ success: true, data: updatedClient })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params
    const deleteClient = await service.deleteOneClient(id)
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export const getClientsBasedOnCoach = async (req, res) => {
  try {
    const { coachIds, page, limit } = req.body;


    const { clients, totalCount } = await service.getClientsBasedOnCoach(
      coachIds,
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json({
      success: true,
      data: clients,
      total: totalCount
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const updateWeight = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentWeight } = req.body;

    const user = await service.updateWeightService(userId, currentWeight);

    res.status(200).json({
      message: "Weight updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMeasurements = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await service.updateMeasurementsService(userId, req.body);

    res.status(200).json({
      message: "Measurements updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};