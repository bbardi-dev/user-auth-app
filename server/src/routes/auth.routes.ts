import express from "express";
import { createSessionHandler, refreshTokenHandler } from "../controllers/auth.controller";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";

const router = express.Router();

router.post("/api/auth", validateResource(createSessionSchema), createSessionHandler);

router.post("/api/auth/refresh", refreshTokenHandler);

export default router;
