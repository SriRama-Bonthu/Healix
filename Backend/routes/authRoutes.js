const express = require("express");

const router = express.Router();

const {
  register,
  verifyRegistration,
  login,
  getDoctors,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/register/verify", verifyRegistration);

router.post("/login", login);
router.get("/doctors", getDoctors);
module.exports = router;
