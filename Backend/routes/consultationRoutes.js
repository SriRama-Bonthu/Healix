const express = require("express");

const router = express.Router();

const {
  createConsultation,
  getConsultation,
} = require("../controllers/consultationController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createConsultation);

router.get("/:id", protect, getConsultation);

module.exports = router;
