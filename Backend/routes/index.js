import express from "express"
import coachRoutes from "../modules/coach/coach.route.js"
import blogRoutes from "../modules/blog/blog.route.js"
// import planRoutes from "../modules/workout/workout.route.js"
import programsRoute from"../modules/allPrograms/allPrograma.route.js"
import testimonialRoutes from "../modules/testimonial/testimonial.routes.js"
import faqRoutes from "../modules/faq/faq.routes.js"
import programRoutes from "../modules/allPrograms/allPrograma.route.js"
import authRoutes from '../modules/auth/auth.routes.js'
import clientRoutes from "../modules/clients/client.routes.js"
import categoryRoutes from '../modules/category/category.routes.js'


const router = express.Router();

router.use('/',authRoutes)
router.use("/clients",clientRoutes)
router.use("/coach", coachRoutes);
router.use('/category',categoryRoutes)
// router.use("/workout", planRoutes);
router.use("/programs", programRoutes);

// router.use("/blog", blogRoutes);
// router.use("/testimonials",testimonialRoutes)
// router.use("/faq",faqRoutes)


export default router;