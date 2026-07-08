import express from "express";
import cors from "cors";
import importRoutes from "./routes/import.routes.js";
import csvRoutes from "./routes/csv.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

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
app.use(errorHandler);

export default app;