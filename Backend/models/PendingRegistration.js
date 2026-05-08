const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    passwordHash: {
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
    contactType: {
      type: String,
      enum: ["email", "phone"],
      required: true,
    },
    contactValue: {
      type: String,
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    otpExpiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

pendingRegistrationSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PendingRegistration", pendingRegistrationSchema);