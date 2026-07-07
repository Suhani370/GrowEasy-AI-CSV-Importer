import { Router } from "express";
import { uploadAndParseCsv } from "../controllers/csv.controller.js";
import { uploadCsv } from "../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/upload",
  uploadCsv.single("file"),
  uploadAndParseCsv
);

export default router;