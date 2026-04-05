import express from "express";
const router = express.Router();
import transactionController from "../controllers/transactionController.js";

router.get('/', transactionController.getAll);
router.post('/', transactionController.create);
router.put('/:id', transactionController.update);
router.delete('/:id', transactionController.delete);

export default router;