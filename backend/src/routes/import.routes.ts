import { Router } from "express";
import { importCsvWithAi } from "../controllers/import.controller.js";
import { uploadCsv } from "../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/process",
  uploadCsv.single("file"),
  importCsvWithAi
);

export default router;