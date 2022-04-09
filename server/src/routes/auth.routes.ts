import express from "express";
import {
  createSessionHandler,
  deleteSessionHandler,
  refreshTokenHandler,
} from "../controllers/auth.controller";
import validateResource from "../middleware/validateResource";
import { createSessionSchema, deleteSessionSchema } from "../schema/auth.schema";

const router = express.Router();

router.post("/api/auth/login", validateResource(createSessionSchema), createSessionHandler);
router.post("/api/auth/logout", validateResource(deleteSessionSchema), deleteSessionHandler);
router.post("/api/auth/refresh", refreshTokenHandler);

export default router;
