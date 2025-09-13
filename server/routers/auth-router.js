const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema, googleLoginSchema } = require('../validators/auth-validator');

// Register
router.post("/register", validate(registerSchema), authControllers.register);

// Login
router.post("/login", validate(loginSchema), authControllers.login);

// Google Login
router.post("/google-login", validate(googleLoginSchema), authControllers.googleLogin);

// Get current user (self)
router.get("/user", authMiddleware, authControllers.user);

// Get current userById (self)
router.get("/user/:id",authControllers.userById);

// Get all users (admin only)
router.get("/users", authMiddleware, isAdmin, authControllers.allUsers);

// Update user by id (admin only)
router.put("/user/:id", authMiddleware, isAdmin, authControllers.updateUser);

// Delete user by id (admin only)
router.delete("/user/:id", authMiddleware, isAdmin, authControllers.deleteUser);

module.exports = router;
