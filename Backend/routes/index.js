import express from "express"
import coachRoutes from "../modules/coach/coach.route.js"
// import planRoutes from "../modules/workout/workout.route.js"
import programRoutes from "../modules/allPrograms/allPrograma.route.js"
import authRoutes from '../modules/auth/auth.routes.js'
import clientRoutes from "../modules/clients/client.routes.js"
import chatRoutes from "../modules/chat/chat.route.js"
import therapyRouts from "../modules/therapy/therapy.route.js"
import headRouts from "../modules/Heads/heads.route.js"

const router = express.Router();

router.use('/',authRoutes)
router.use("/clients",clientRoutes)
router.use("/coach", coachRoutes);
// router.use('/category',categoryRoutes)
// router.use("/workout", planRoutes);
router.use("/programs", programRoutes);
router.use("/chats",chatRoutes)
router.use("/therapy", therapyRouts);
router.use("/heads", headRouts);



export default router;