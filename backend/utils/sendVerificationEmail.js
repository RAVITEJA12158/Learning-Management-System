const emailjs = require('@emailjs/nodejs');

function isEmailJsConfigured() {
  return Boolean(
    process.env.EMAILJS_SERVICE_ID &&
    process.env.EMAILJS_TEMPLATE_ID &&
    process.env.EMAILJS_PUBLIC_KEY &&
    process.env.EMAILJS_PRIVATE_KEY
  );
}

function getEmailJsAuthOptions() {
  const options = {
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
  };
  // @emailjs/nodejs requires `privateKey` for server-side API requests
  if (process.env.EMAILJS_PRIVATE_KEY) {
    options.privateKey = process.env.EMAILJS_PRIVATE_KEY;
  }
  return options;
}

const sendVerificationEmail = async ({ email, name, verificationLink }) => {
  if (!isEmailJsConfigured()) {
    console.warn(
      `[EmailJS] Skipping verification email to ${email}: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, or EMAILJS_PUBLIC_KEY is not configured in .env.`
    );
    return { skipped: true };
  }

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        name,
        to_name: name,
        email,
        to_email: email,
        verification_link: verificationLink,
        action_url: verificationLink,
        subject: 'Verify your CourseHub LMS account',
        message: `Welcome to CourseHub, ${name}! Please verify your account using this link: ${verificationLink}`,
      },
      getEmailJsAuthOptions()
    );

    console.log(`Verification email sent to ${email}`);
    return { sent: true };
  } catch (error) {
    console.error('EmailJS verification email error:', error);
    throw new Error('Failed to send verification email');
  }
};

const sendPasswordResetEmail = async ({ email, name, resetToken, resetLink }) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_RESET_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn(
      `[EmailJS] Skipping password reset email to ${email}: EmailJS environment variables are not configured.`
    );
    return { skipped: true };
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        name,
        to_name: name,
        email,
        to_email: email,
        reset_code: resetToken,
        reset_link: resetLink,
        verification_link: resetLink,
        action_url: resetLink,
        subject: 'CourseHub LMS Password Reset Code',
        message: `Your CourseHub password reset code is ${resetToken} (valid for 15 minutes). You can also reset directly at: ${resetLink}`,
      },
      getEmailJsAuthOptions()
    );

    console.log(`Password reset email sent to ${email}`);
    return { sent: true };
  } catch (error) {
    console.error('EmailJS password reset error:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = sendVerificationEmail;
module.exports.sendVerificationEmail = sendVerificationEmail;
module.exports.sendPasswordResetEmail = sendPasswordResetEmail;