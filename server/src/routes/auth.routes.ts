import express from "express";

const router = express.Router();

router.get("/auth", (req, res) => res.json("Auth"));

export default router;
