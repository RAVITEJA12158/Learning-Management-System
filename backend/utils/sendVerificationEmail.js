const emailjs = require("@emailjs/nodejs");

const sendVerificationEmail = async ({
  email,
  name,
  verificationLink,
}) => {
  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        name,
        email,
        verification_link: verificationLink,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
      }
    );

    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("EmailJS error:", error);
    throw new Error("Failed to send verification email");
  }
};

module.exports = sendVerificationEmail;