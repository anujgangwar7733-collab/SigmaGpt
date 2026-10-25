import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import dns from "dns";
import chatRoutes from "./routes/chat.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
}

