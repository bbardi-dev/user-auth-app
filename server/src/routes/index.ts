import express from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";

const router = express.Router();

router.get("/hello", (req, res) => res.json("Hello"));

router.use(userRoutes);
router.use(authRoutes);

export default router;
