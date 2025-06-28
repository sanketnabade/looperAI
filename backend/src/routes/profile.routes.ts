import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getProfile,
  updateProfile,
  deleteAccount,
} from "../controllers/profile.controller";

const router = express.Router();

router.use(protect);

router.get("/me", getProfile);
router.put("/me", updateProfile);
router.delete("/me", deleteAccount);

export default router;
