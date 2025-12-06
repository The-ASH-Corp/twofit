import express from "express";
import { getLogs, logWorkout } from "../../controllers/workout/logController.js";
// import { logWorkout, getLogs } from "../controllers/logController.js";
// import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/" ,getLogs  );
router.get("/:userId", logWorkout );

export default router;
