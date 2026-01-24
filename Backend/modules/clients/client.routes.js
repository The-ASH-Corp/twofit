import express from "express";
import {
  deleteClient,
  getAllClients,
  getAllFeedbacks,
  getClientsBasedOnCoach,
  getMeasurementHistoryOnly,
  getSingleClient,
  getWeightHistoryOnly,
  updateClient,
  updateMeasurements,
  updateWeight,
  getFounderClientList,
  getComplianceStats,
} from "./client.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";


const router = express.Router()

router.get("/all-clients/:page/:limit", getAllClients)
router.get("/founder/list/:page/:limit", getFounderClientList);
router.get("/all-clients/:page/:limit", getAllClients);
router.get("/get-client/:id", getSingleClient)
router.post("/update-client/:id", updateClient)
router.delete("/delete-client/:id", deleteClient)

router.post("/get-all-users-based-on-coach-for-admin", getClientsBasedOnCoach)

router.put("/:userId/weight", updateWeight);
router.put("/:userId/measurements", updateMeasurements);
router.get("/get-all-feedbacks/:userId", getAllFeedbacks)
router.get("/weight-history",authMiddleware, getWeightHistoryOnly);
router.get("/measurement-history",authMiddleware, getMeasurementHistoryOnly);
router.get("/compliance-stats",authMiddleware, getComplianceStats);


export default router;