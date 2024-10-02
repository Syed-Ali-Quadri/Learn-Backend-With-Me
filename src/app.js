import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { CONFIG_EXPRESS_LIMIT } from "./constants.js";

const app = express();

dotenv.config({
  path: "./.env",
});

// Configure express
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: CONFIG_EXPRESS_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: CONFIG_EXPRESS_LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import registerUser from "./routes/registerUser.routes.js"
import loginUser from "./routes/loginUser.routes.js";
import logoutUser from "./routes/secure/logoutUser.routes.js";
import refreshAccess from "./routes/secure/refreshAccessToken.routes.js";
import changePassword from "./routes/secure/changePassword.routes.js"
import changeUserDetails from "./routes/secure/changeUserDetails.routes.js";

// Routers Decleration
app.use("/api/v1/users", registerUser)
app.use("/api/v1/users", loginUser)
app.use("/api/v1/users", logoutUser)
app.use("/api/v1/users", refreshAccess)
app.use("/api/v1/users", changePassword)
app.use("/api/v1/users", changeUserDetails)


export { app };
