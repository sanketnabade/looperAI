import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  exportTransactions,
  getExportableFields,
} from "../controllers/export.controller";

const router = express.Router();

router.use(protect);
router.get("/fields", getExportableFields);
router.post("/transactions", exportTransactions);

export default router;
