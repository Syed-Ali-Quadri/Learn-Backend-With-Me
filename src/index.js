import connectDB from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;

// Second thing you can do is that you can write connection db code in another file and you can import.

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
    app.on("error", () => {
      console.error("Error: ", error);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Failed: ", error);
  });

// There are 2 ways to configure mongoDB.
// 1. Configure mongo db with the following configuration below.
// 2. Configure mongo db with external configuration.

/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

const app = express();

(async () => {
  // Connecting MongoDB.
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("ERR", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("ERROR: ", error);
    throw error;
  }
})(); 
*/
