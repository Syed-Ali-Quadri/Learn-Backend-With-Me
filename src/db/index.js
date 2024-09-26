import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("\n MongoDB Connected!!", connectionInstance.connection.host);
  } catch (error) {
    console.log("The database connection is broken: ", error);
    process.exit(1);
  }
};

export default connectDB;
