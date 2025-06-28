import express from "express";
import { protect } from "../middleware/auth.middleware";
import { exportTransactions } from "../controllers/export.controller";

const router = express.Router();

router.use(protect);
router.post("/transactions", exportTransactions);

export default router;
