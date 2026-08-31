const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getDoctors,
  getProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);

router.post("/login", login);
router.get("/doctors", getDoctors);
router.get("/profile", protect, getProfile);
module.exports = router;
