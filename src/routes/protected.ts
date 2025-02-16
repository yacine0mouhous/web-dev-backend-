import express from "express";
import { verifyAuth } from "../middlewares/authMiddleware";
import verifieRole from "../middlewares/verifyRoleMiddleware";

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

// ✅ Role-based route (Owner only)
verifier_router.get("/owner", verifyAuth, verifieRole(["owner"]), (req, res) => {
  res.json({ message: "Authenticated user with owner role", user: req.user });
});

// ✅ Admin-only Route
verifier_router.get("/admin", verifyAuth, verifieRole(["admin"]), (req, res) => {
  res.json({ message: "Admin-only access granted", user: req.user });
});

// ✅ Client-only Route
verifier_router.get("/client", verifyAuth, verifieRole(["client"]), (req, res) => {
  res.json({ message: "Client-only access granted", user: req.user });
});

// ✅ Admin or Owner Route (Accessible by either admin or owner)
verifier_router.get("/admin-or-owner", verifyAuth, verifieRole(["admin", "owner"]), (req, res) => {
  res.json({ message: "Access granted to admin or owner", user: req.user });
});

// ✅ All Roles Route (Accessible by any user with any role)
verifier_router.get("/all-roles", verifyAuth, (req, res) => {
  res.json({ message: "Access granted to any authenticated user", user: req.user });
});

export default verifier_router;
