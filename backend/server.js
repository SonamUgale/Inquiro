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

import fs from "fs"; // ADD THIS IMPORT

const frontendPath = path.join(__dirname, "../frontend/build");

if (process.env.NODE_ENV === "production" && fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log("Server failed to start", error);
  }
};

startServer();
