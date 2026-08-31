const express = require("express");

const router = express.Router();

const {
  createAppointment,

  getDoctorAppointments,

  getPatientAppointments,

  approveAppointment,

  startConsultation,

  endConsultation,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createAppointment);

router.get("/doctor", protect, getDoctorAppointments);

router.get("/patient", protect, getPatientAppointments);

router.put("/approve/:id", protect, approveAppointment);

router.put("/start/:id", protect, startConsultation);

router.put("/end/:id", protect, endConsultation);

module.exports = router;
