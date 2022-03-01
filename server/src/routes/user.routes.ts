import express from "express";

const router = express.Router();

router.post("/api/users", (req, res) => {
  return res.json("Hello from users");
});

export default router;
