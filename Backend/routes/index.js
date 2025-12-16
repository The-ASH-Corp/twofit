import express from "express"
import coachRoutes from "../modules/coach/coach.route.js"
import blogRoutes from "../modules/blog/blog.route.js"
import planRoutes from "../modules/workout/workout.route.js"
import programsRoute from"../modules/allPrograms/allPrograma.route.js"
import testimonialRoutes from "../modules/testimonial/testimonial.routes.js"
import faqRoutes from "../modules/faq/faq.routes.js"
import programRoutes from "../modules/allPrograms/allPrograma.route.js"
import authRoutes from '../modules/auth/auth.routes.js'

const router = express.Router();

router.use("/coach", coachRoutes);
router.use("/blog", blogRoutes);
router.use("/workout", planRoutes);
router.use("/programs", programRoutes);
router.use("/testimonials",testimonialRoutes)
router.use("/faq",faqRoutes)
router.use('/',authRoutes)



export default router;