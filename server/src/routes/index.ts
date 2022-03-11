import express from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";

const router = express.Router();

//connecting individual sets of routes
router.use(userRoutes);
router.use(authRoutes);

export default router;
