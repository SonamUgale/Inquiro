import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chatRoute from "./routes/chat.js";
import path from "path";
import { fileURLToPath } from "url";
configDotenv();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoute);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}
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
