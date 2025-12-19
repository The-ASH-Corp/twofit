import express from "express";
import { deleteClient, getAllClients, getSingleClient, updateClient } from "./client.controller.js";


const router =express.Router()

router.get("/all-clients/:page/:limit",getAllClients)
router.get("/get-client/:id",getSingleClient)
router.post("/update-client/:id",updateClient)
router.delete("/delete-client/:id",deleteClient)

export default router;