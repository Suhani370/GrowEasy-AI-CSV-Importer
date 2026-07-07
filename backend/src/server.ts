import importRoutes from "./routes/import.routes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import csvRoutes from "./routes/csv.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/import", importRoutes);
app.use("/api/csv", csvRoutes);
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "GrowEasy AI CSV Importer API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});