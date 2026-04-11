// require("dotenv").config({path: "./.env" });

import dotenv from "dotenv";
dotenv.config({path: "./.env"});

import express from "express";
const app = express();
import connectDB from "./db/index.js";







connectDB();

























































/*
import dotenv from "dotenv";
import express from "express";
dotenv.config();
const app = express();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    app.on("error", (err) => {
      console.log("Error connecting to MongoDB:", err);
    });
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    throw error;
  }
})();
*/
