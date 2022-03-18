import express from "express";
import { createSessionHandler } from "../controllers/auth.controller";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";

const router = express.Router();

router.post("/api/auth", validateResource(createSessionSchema), createSessionHandler);

export default router;
