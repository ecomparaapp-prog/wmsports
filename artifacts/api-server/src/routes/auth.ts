import { Router } from "express";

const router = Router();

// Simple health check — auth is now handled client-side via localStorage
router.get("/auth/status", (_req, res) => {
  res.json({ ok: true });
});

export default router;
