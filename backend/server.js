import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chatRoute from "./routes/chat.js";
configDotenv();

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoute);

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected with database !");
  } catch (error) {
    console.log("Failed to connect with database", error);
  }
};

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  connectDB();
});
