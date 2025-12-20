import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router1 from "./routes/index.js";
import cors from "cors";
import {connectRedis} from "./redis/redisClient.js"
import morgan from "morgan";
import cookieParser from "cookie-parser";



const app = express();

dotenv.config();

// BODY PARSER MUST COME FIRST
app.use(express.json());
app.use(cookieParser())

// app.use(express.urlencoded({ extended: true }))

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5000"],
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));
app.use(morgan("dev")); 



app.use("/api/v1", router1);

await connectRedis()
mongoose
  .connect(process.env.MONGOURI)
  .then(() => console.log("connected"))
  .catch(() => console.log("not connected"));

app.listen(process.env.PORT, () =>
  console.log(`server is running at port ${process.env.PORT}`)
);
