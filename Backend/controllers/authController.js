const User = require("../models/User");
const PendingRegistration = require("../models/PendingRegistration");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

const { sendEmailOtp, sendPhoneOtp } = require("../utils/otpService");

const OTP_EXPIRES_IN_MINUTES = 10;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[1-9]\d{7,14}$/;

const normalizeContact = (value = "") => value.trim().replace(/[\s-]/g, "");

const resolveContact = (rawValue) => {
  const normalizedValue = normalizeContact(rawValue);

  if (!normalizedValue) {
    return null;
  }

  if (emailPattern.test(normalizedValue)) {
    return {
      type: "email",
      value: normalizedValue.toLowerCase(),
    };
  }

  const phoneValue = normalizedValue.replace(/[^\d+]/g, "");

  if (phonePattern.test(phoneValue)) {
    return {
      type: "phone",
      value: phoneValue.startsWith("+") ? phoneValue : `+${phoneValue}`,
    };
  }

  return null;
};

const generateOtp = () => String(crypto.randomInt(100000, 1000000));

const buildRegistrationPayload = ({
  name,
  email,
  phoneNumber,
  passwordHash,
  role,
  specialization = "",
  experience = "",
  consultationFee = 0,
  profileImage = "",
}) => {
  const payload = {
    name,
    password: passwordHash,
    role,
    specialization,
    experience,
    consultationFee,
    profileImage,
  };

  if (email) {
    payload.email = email;
  }

  if (phoneNumber) {
    payload.phoneNumber = phoneNumber;
  }

  return payload;
};

const sendOtp = async ({ contactType, contactValue, otp }) => {
  if (contactType === "email") {
    await sendEmailOtp({ to: contactValue, otp });
    return;
  }

  await sendPhoneOtp({ to: contactValue, otp });
};

const register = async (req, res) => {
  try {
    const {
      name,
      password,
      role,
      specialization = "",
      experience = "",
      consultationFee = 0,
      profileImage = "",
      contact,
    } = req.body;

    const resolvedContact = resolveContact(contact || req.body.email || req.body.phoneNumber);

    if (!resolvedContact) {
      return res.status(400).json({
        message: "Enter a valid email address or phone number with country code.",
      });
    }

    const { type: contactType, value: contactValue } = resolvedContact;

    const userExists = await User.findOne({
      $or: [
        contactType === "email" ? { email: contactValue } : { phoneNumber: contactValue },
        contactType === "email" ? { phoneNumber: contactValue } : { email: contactValue },
      ],
    });

    if (userExists) {
      return res.status(400).json({
        message: "An account already exists for that email address or phone number.",
      });
    }

    const otp = generateOtp();
    const passwordHash = await bcrypt.hash(password, 10);
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MINUTES * 60 * 1000);

    await PendingRegistration.findOneAndDelete({ contactValue });

    const pendingRegistration = await PendingRegistration.create({
      name,
      email: contactType === "email" ? contactValue : undefined,
      phoneNumber: contactType === "phone" ? contactValue : undefined,
      passwordHash,
      role,
      specialization,
      experience,
      consultationFee,
      profileImage,
      contactType,
      contactValue,
      otpHash,
      otpExpiresAt,
    });

    try {
      await sendOtp({ contactType, contactValue, otp });
    } catch (sendError) {
      await PendingRegistration.findByIdAndDelete(pendingRegistration._id);

      return res.status(503).json({
        message: sendError.message,
      });
    }

    res.status(200).json({
      message: `Verification code sent to your ${contactType}.`,
      pendingRegistrationId: pendingRegistration._id,
      contactType,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyRegistration = async (req, res) => {
  try {
    const { pendingRegistrationId, otp } = req.body;

    if (!pendingRegistrationId || !otp) {
      return res.status(400).json({
        message: "Pending registration and OTP are required.",
      });
    }

    const pendingRegistration = await PendingRegistration.findById(pendingRegistrationId);

    if (!pendingRegistration) {
      return res.status(400).json({
        message: "Verification code expired. Please request a new one.",
      });
    }

    if (pendingRegistration.otpExpiresAt.getTime() < Date.now()) {
      await PendingRegistration.findByIdAndDelete(pendingRegistrationId);

      return res.status(400).json({
        message: "Verification code expired. Please request a new one.",
      });
    }

    const isOtpValid = await bcrypt.compare(String(otp).trim(), pendingRegistration.otpHash);

    if (!isOtpValid) {
      return res.status(400).json({
        message: "Invalid verification code.",
      });
    }

    const userExists = await User.findOne({
      $or: [
        pendingRegistration.email ? { email: pendingRegistration.email } : null,
        pendingRegistration.phoneNumber ? { phoneNumber: pendingRegistration.phoneNumber } : null,
      ].filter(Boolean),
    });

    if (userExists) {
      await PendingRegistration.findByIdAndDelete(pendingRegistrationId);

      return res.status(400).json({
        message: "An account already exists for this registration details.",
      });
    }

    const user = await User.create(
      buildRegistrationPayload({
        name: pendingRegistration.name,
        email: pendingRegistration.email,
        phoneNumber: pendingRegistration.phoneNumber,
        passwordHash: pendingRegistration.passwordHash,
        role: pendingRegistration.role,
        specialization: pendingRegistration.specialization,
        experience: pendingRegistration.experience,
        consultationFee: pendingRegistration.consultationFee,
        profileImage: pendingRegistration.profileImage,
      }),
    );

    await PendingRegistration.findByIdAndDelete(pendingRegistrationId);

    res.status(201).json({
      message: "Registration verified successfully.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, email, password } = req.body;

    const loginIdentifier = identifier || email;

    if (!loginIdentifier) {
      return res.status(400).json({
        message: "Enter your email address or phone number.",
      });
    }

    const resolvedContact = resolveContact(loginIdentifier);

    const user = await User.findOne(
      resolvedContact?.type === "phone"
        ? { phoneNumber: resolvedContact.value }
        : { email: resolvedContact ? resolvedContact.value : loginIdentifier.trim().toLowerCase() },
    );

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  register,
  verifyRegistration,
  login,
  getDoctors,
};
