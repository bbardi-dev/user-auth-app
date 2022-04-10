import express from "express";
import { createSessionHandler, deleteSessionHandler } from "../controllers/auth.controller";
import validateResource from "../middleware/validateResource";
import { createSessionSchema, deleteSessionSchema } from "../schema/auth.schema";

const router = express.Router();

router.post("/api/auth/login", validateResource(createSessionSchema), createSessionHandler);
router.post("/api/auth/logout", validateResource(deleteSessionSchema), deleteSessionHandler);

export default router;
