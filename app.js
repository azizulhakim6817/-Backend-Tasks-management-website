//! Basic import.............
import express from "express";
import router from "./src/routes/api.js";

const app = express();

//! Security Middleware Library import....
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import xss from "xss-clean";
import cors from "cors";
import helmet from "helmet"; 

//! Database Library import .............
import mongoose from "mongoose";

//! Security Middleware implementation....................
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

//! Body Parser Middleware implementation...............
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


//! Rate Limiting middleware implementation...............
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000, // limit each IP to 3000 requests per 15 mins
});
app.use(limiter);

//! MongoDB Database Connection...............
const URL =
  "mongodb+srv://azizulhakim2345:azizulhakim2345@cluster0.bd9lr.mongodb.net/task-management-project";
const OPTIONS = { autoIndex: true };

mongoose
  .connect(URL, OPTIONS)
  .then(() => console.log("✅ MongoDB connection successful"))
  .catch((error) => console.log("❌ MongoDB connection error:", error));

//! API routes implementation...............
app.use("/api", router);

//! Undefined route handling.................
app.use("*", (req, res) => {
  res.status(404).json({ status: "Fail", data: "Not Found" });
});

export default app;
