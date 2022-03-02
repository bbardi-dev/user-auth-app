import express from "express";
import { createUserHandler } from "../controllers/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";

const router = express.Router();

router.post("/api/users", validateResource(createUserSchema), createUserHandler);

export default router;
