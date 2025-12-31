import express from "express";
import * as adminController from "./admin.controller.js"

const router =express.Router()

router.get("/all-admins/:page/:limit",adminController.getAllAdmins)


export default router;