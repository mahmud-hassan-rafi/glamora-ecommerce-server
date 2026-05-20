import express from "express";
import AuthRouter from "./auth.route";
import ProductRouter from "./product.route";

const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/products", ProductRouter);

export default router;
