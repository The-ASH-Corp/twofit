import express from 'express'
import mongoose from 'mongoose'
// import planRoutes from './routes/workout/planRoutes.js'
// import assignRoutes from './routes/workout/assignRoutes.js'
import logRoutes from './routes/workout/logRoutes.js'
import nutritionPlanRoutes from './routes/nutrition/planRoutes.js'
import nutritionLogRoutes from './routes/nutrition/logRoutes.js'
import assignNRoutes from './routes/nutrition/assignRoutes.js'
import dotenv from 'dotenv'
import router from './routes/authRoutes.js'
import router1 from "./routes/index.js"
import cors from "cors";

const app= express()



dotenv.config()

// BODY PARSER MUST COME FIRST
app.use(express.json())
 
// app.use(express.urlencoded({ extended: true }))

app.use(cors())


app.use("/uploads", express.static("uploads"));



// ROUTES
// app.use('/api/v1', router)
// app.use("/api/v1/workout/plans", planRoutes);
// app.use("/api/v1/workout/assign", assignRoutes);
// app.use("/api/v1/workout/logs", logRoutes);

// app.use("/api/v1/nutrition/plans", nutritionPlanRoutes);
// app.use("/api/v1/nutrition/assign", assignNRoutes);
// app.use("/api/v1/nutrition/logs", nutritionLogRoutes);

app.use("/api/v1", router1)



mongoose.connect(process.env.MONGOURI)
.then(()=>console.log("connected"))
.catch(()=>console.log("not connected"))

 




app.listen(process.env.PORT,()=>console.log(`server is running at port ${process.env.PORT}`))