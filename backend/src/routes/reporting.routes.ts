import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getMonthlyReport,
  getYearlyReport,
  getCategoryTrends,
  getIncomeExpenseAnalysis,
} from "../controllers/reporting.controller";

const router = express.Router();

router.use(protect);

router.get("/monthly", getMonthlyReport);
router.get("/yearly", getYearlyReport);
router.get("/trends", getCategoryTrends);
router.get("/income-expense", getIncomeExpenseAnalysis);

export default router;
