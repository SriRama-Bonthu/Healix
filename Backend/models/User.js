const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },

  phoneNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,

    enum: ["patient", "doctor"],

    required: true,
  },

  specialization: {
    type: String,
    default: "",
  },

  experience: {
    type: String,
    default: "",
  },

  consultationFee: {
    type: Number,
    default: 0,
  },

  profileImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("User", userSchema);
