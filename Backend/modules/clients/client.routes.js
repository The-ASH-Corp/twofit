import express from "express";
import { deleteClient, getAllClients, getClientsBasedOnCoach, getSingleClient, updateClient, updateMeasurements, updateWeight } from "./client.controller.js";


const router = express.Router()

router.get("/all-clients/:page/:limit", getAllClients)
router.get("/get-client/:id", getSingleClient)
router.post("/update-client/:id", updateClient)
router.delete("/delete-client/:id", deleteClient)

router.post("/get-all-users-based-on-coach-for-admin", getClientsBasedOnCoach)

router.put("/:userId/weight", updateWeight);
router.put("/:userId/measurements", updateMeasurements);




export default router;