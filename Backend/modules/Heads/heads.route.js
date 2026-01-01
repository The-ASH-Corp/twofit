import express from 'express';
import * as headsController from './heads.controller.js';

const router = express.Router();

router.post('/create', headsController.createHead);
router.get("/get-all-heads/:page/:limit", headsController.getAllHeads);
router.get("/get-head/:id", headsController.getHeadById);
router.put("/update/:id", headsController.updateHead);
router.delete("/delete/:id", headsController.deleteHead);

export default router;