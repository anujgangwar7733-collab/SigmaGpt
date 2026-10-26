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
    const uri = process.env.MONGODB_URI || "mongodb+srv://anujgangwar7733_db_user:B62QUwhQILNSKqgc@cluster0.7lty8gv.mongodb.net/?retryWrites=true&w=majority";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.log("Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

