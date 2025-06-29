import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.middleware";
import {
  getProfile,
  updateProfile,
  deleteAccount,
  uploadAvatar,
} from "../controllers/profile.controller";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.use(protect);

router.get("/", getProfile);
router.put("/", updateProfile);
router.post("/avatar", upload.single("avatar"), uploadAvatar);
router.delete("/me", deleteAccount);

export default router;
