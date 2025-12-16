import express from "express";
import { getAllClients, getSingleClient } from "./client.controller.js";


const router =express.Router()

router.get("/all-clients",getAllClients)
router.get("/get-client",getSingleClient)

export default router;