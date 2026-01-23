import * as service from "./client.services.js";
import { getUserComplianceStats } from "../../utils/complianceCalculator.js";
import { getSingleProgram } from "../allPrograms/allPrograma.service.js";

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

export const getAllFeedbacks = async (req, res) => {
  try {
    const { userId } = req.params;
    const feedbacks = await service.getAllFeedbacksService(userId);
    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 


 
export const getWeightHistoryOnly = async (req, res) => {
      console.log("req.user:", req.user);

  try {
    const userId = req.user.id; 
  


    const data = await service.fetchWeightHistoryService(userId);

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch weight history",
    });
  }
};



export const getMeasurementHistoryOnly = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await service.fetchMeasurementHistory(userId);

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch measurement history",
    });
  }
};

export const getFounderClientList = async (req, res) => {
  try {
    const { page, limit } = req.params;

    const list = await service.founderClientList(page, limit);

    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getComplianceStats = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await service.getSingleClient(userId);
    
    if (!user || !user.programType) {
      return res.status(200).json({ 
        success: true, 
        data: {
          overall: 0,
          workout: 0,
          diet: 0,
          therapy: 0,
          weeklyData: []
        }
      });
    }

    const programId = typeof user.programType === 'object' ? user.programType._id : user.programType;
    const program = await getSingleProgram(programId);
    
    const complianceData = await getUserComplianceStats(userId, program?.plan);
    
    res.status(200).json({ success: true, data: complianceData });
  } catch (error) {
    console.error("Compliance stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


