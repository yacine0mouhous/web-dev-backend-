import express from "express";

import { verifyAuth } from "../middlewares/authMiddleware";

const verifier_router = express.Router();
console.log("verifier_router");
// ✅ Public Route (No Auth Needed)
verifier_router.get("/", (req, res) => {
  res.json({ message: "Public route, no authentication required" });
});

// ✅ Protected Route (Any Authenticated User)
verifier_router.get("/protected", verifyAuth, (req, res) => {
  res.json({ message: "Authenticated user access granted", user: req.user });
});


export default verifier_router;
