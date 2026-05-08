const nodemailer = require("nodemailer");
const twilio = require("twilio");

const createOtpTransport = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    streamTransport: true,
    newline: "unix",
    buffer: true,
  });
};

const sendEmailOtp = async ({ to, otp }) => {
  const transport = createOtpTransport();
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@healix.local";

  const info = await transport.sendMail({
    from: fromAddress,
    to,
    subject: "Healix registration verification code",
    text: `Your Healix verification code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="margin: 0 0 12px;">Healix verification code</h2>
        <p style="margin: 0 0 12px;">Use this code to verify your registration:</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; padding: 12px 0;">${otp}</div>
        <p style="margin: 0;">This code expires in 10 minutes.</p>
      </div>
    `,
  });

  if (process.env.SMTP_HOST) {
    console.log(`OTP email sent to ${to}`);
  } else {
    console.log(`Dev OTP for ${to}: ${otp}`);
  }

  return info;
};

const sendPhoneOtp = async ({ to, otp }) => {
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  ) {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    const message = await client.messages.create({
      body: `Your Healix verification code is ${otp}. It expires in 10 minutes.`,
      from: process.env.TWILIO_FROM_NUMBER,
      to,
    });

    console.log(`OTP SMS sent to ${to}`);

    return message;
  }

  console.log(`Dev OTP for ${to}: ${otp}`);

  return null;
};

module.exports = {
  sendEmailOtp,
  sendPhoneOtp,
};