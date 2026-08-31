const Appointment = require("../models/Appointment");

const User = require("../models/User");

const createAppointment = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can book appointments" });
    }

    const { doctor, date, time } = req.body;

    const patient = await User.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const doctorUser = await User.findById(doctor);

    if (!doctorUser) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (doctorUser.role !== "doctor") {
      return res.status(400).json({ message: "Appointments can only be booked with doctors" });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,

      doctor,

      patientName: patient.name,

      doctorName: doctorUser.name,

      date,

      time,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id,
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user.id,
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const approveAppointment = async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can approve appointments" });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only approve your own appointments" });
    }

    appointment.status = "approved";

    appointment.consultationRoom = `heal-${appointment._id}`;

    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const startConsultation = async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can start consultations" });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only start your own appointments" });
    }

    if (!appointment.consultationRoom) {
      appointment.consultationRoom = `heal-${appointment._id}`;
    }

    appointment.status = "live";

    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const endConsultation = async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can end consultations" });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only end your own appointments" });
    }

    appointment.status = "completed";

    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createAppointment,

  getDoctorAppointments,

  getPatientAppointments,

  approveAppointment,

  startConsultation,

  endConsultation,
};
