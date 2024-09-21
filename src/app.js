import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { CONFIG_EXPRESS_LIMIT } from "./constants";

const app = express();

dotenv.config({
  path: "./.env",
});

// Configure express
app.use(
  cors({
    origin: "process.env.CORS_ORIGIN",
    credentials: true,
  })
);
app.use(express.json({ limit: CONFIG_EXPRESS_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: CONFIG_EXPRESS_LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

export { app };
