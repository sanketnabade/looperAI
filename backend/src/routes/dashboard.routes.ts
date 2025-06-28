import express from "express";
import { protect } from "../middleware/auth.middleware";
import { getDashboardMetrics } from "../controllers/dashboard.controller";

const router = express.Router();

router.use(protect);
router.get("/metrics", getDashboardMetrics);

export default router;
