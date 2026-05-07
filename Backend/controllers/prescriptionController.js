const Prescription = require("../models/Prescription");

const Appointment = require("../models/Appointment");

const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, dosage, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    const prescription = await Prescription.create({
      appointment: appointmentId,

      doctor: appointment.doctor,

      patient: appointment.patient,

      medicines,

      dosage,

      notes,
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patient: req.user.id,
    })

      .populate("doctor");

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPrescription,
  getPatientPrescriptions,
};
