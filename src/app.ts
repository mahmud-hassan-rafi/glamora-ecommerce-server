import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDB from "./config/db";
import dotenv from "dotenv";
import ApiRoutes from "./routes/api.routes";

dotenv.config({ path: ".env.local" });

const app = express();

// connect to database
connectToDB();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://glaroma-ecommerce-client.vercel.app/",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// global middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// routes
app.get("/", (req, res) => res.send("API is working"));
app.use("/api", ApiRoutes);

export default app;
