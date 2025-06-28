import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller";

const router = express.Router();

// All routes are protected
router.use(protect);

router.route("/").get(getTransactions).post(createTransaction);

router
  .route("/:id")
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
