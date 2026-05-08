const nodemailer = require("nodemailer");
const twilio = require("twilio");

const getEnvValue = (...keys) => {
  for (const key of keys) {
    if (process.env[key]) {
      return process.env[key];
    }
  }

  return undefined;
};

const createOtpTransport = () => {
  const host = getEnvValue("SMTP_HOST", "EMAIL_HOST");
  const user = getEnvValue("SMTP_USER", "EMAIL_USER");
  const pass = getEnvValue("SMTP_PASS", "EMAIL_PASS");
  const port = getEnvValue("SMTP_PORT", "EMAIL_PORT");

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: Number(port) === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  return null;
};

const sendEmailOtp = async ({ to, otp }) => {
  const transport = createOtpTransport();

  if (!transport) {
    throw new Error(
      "Email OTP is not configured. Set SMTP_HOST/SMTP_USER/SMTP_PASS or EMAIL_HOST/EMAIL_USER/EMAIL_PASS.",
    );
  }

  const fromAddress = getEnvValue("SMTP_FROM", "EMAIL_FROM") || getEnvValue("SMTP_USER", "EMAIL_USER");

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
  const accountSid = getEnvValue("TWILIO_ACCOUNT_SID");
  const authToken = getEnvValue("TWILIO_AUTH_TOKEN");
  const fromNumber = getEnvValue("TWILIO_FROM_NUMBER", "TWILIO_PHONE_NUMBER", "TWILIO_FROM");

  if (accountSid && authToken && fromNumber) {
    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      body: `Your Healix verification code is ${otp}. It expires in 10 minutes.`,
      from: fromNumber,
      to,
    });

    console.log(`OTP SMS sent to ${to}`);

    return message;
  }

  throw new Error(
    "SMS OTP is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER or TWILIO_PHONE_NUMBER.",
  );
};

module.exports = {
  sendEmailOtp,
  sendPhoneOtp,
};