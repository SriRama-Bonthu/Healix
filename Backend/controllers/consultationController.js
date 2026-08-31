const Consultation = require("../models/Consultation");
const Appointment = require("../models/Appointment");

const createConsultation = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    const roomId = `heal-${appointmentId}`;

    const consultation = await Consultation.create({
      appointment: appointmentId,
      roomId,
      startedBy: req.user.id,
    });

    res.status(201).json(consultation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        message: "Consultation not found",
      });
    }

    res.json(consultation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createConsultation,
  getConsultation,
};
