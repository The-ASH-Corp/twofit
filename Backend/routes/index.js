import express from "express"
import coachRoutes from "../modules/coach/coach.route.js"
import workoutRoutes from "../modules/workoutTemplate/workout.routes.js"
import programRoutes from "../modules/allPrograms/allPrograma.route.js"
import authRoutes from '../modules/auth/auth.routes.js'
import clientRoutes from "../modules/clients/client.routes.js"
import chatRoutes from "../modules/chat/chat.route.js"
import therapyRouts from "../modules/therapy/therapy.route.js"
import adminRoutes from "../modules/admin/admin.routes.js"
import headRouts from "../modules/Heads/heads.route.js"
import categoryRouts from "../modules/category/category.routes.js"
import planRoutes from "../modules/plan/plan.route.js"

const router = express.Router();

router.use('/',authRoutes)
router.use("/clients",clientRoutes)
router.use("/coach", coachRoutes);
router.use("/workout", workoutRoutes);
router.use("/programs", programRoutes);
router.use("/chats",chatRoutes)
router.use("/therapy", therapyRouts);
router.use("/admin",adminRoutes)
router.use("/heads", headRouts);
router.use("/category", categoryRouts)
router.use("/plans",planRoutes)



export default router;