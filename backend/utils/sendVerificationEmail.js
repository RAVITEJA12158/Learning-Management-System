
const emailjs = require('@emailjs/nodejs');

function isEmailJsConfigured(templateId) {
  return Boolean(
    process.env.EMAILJS_SERVICE_ID &&
    templateId &&
    process.env.EMAILJS_PUBLIC_KEY &&
    process.env.EMAILJS_PRIVATE_KEY
  );
}

function getEmailJsAuthOptions() {
  return {
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY,
  };
}

// Send welcome email after successful registration
const sendWelcomeEmail = async ({ email, name }) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;

  if (!isEmailJsConfigured(templateId)) {
    console.warn('[EmailJS] Welcome email skipped: configuration missing.');
    return { skipped: true };
  }

  try {
    const frontendBase = (
      process.env.FRONTEND_URL || 'http://localhost:3000'
    ).replace(/\/+$/, '');

    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: email,
        to_name: name,
        login_link: `${frontendBase}/login`,
      },
      getEmailJsAuthOptions()
    );

    console.log(`[EmailJS] Welcome email sent to ${email}`);

    return { sent: true };
  } catch (error) {
    console.error('[EmailJS] Welcome email error:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async ({
  email,
  name,
  resetToken,
  resetLink,
}) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_RESET_TEMPLATE_ID;

  if (!isEmailJsConfigured(templateId)) {
    console.warn('[EmailJS] Password reset email skipped: configuration missing.');
    return { skipped: true };
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: email,
        to_name: name,
        reset_code: resetToken,
        reset_link: resetLink,
        message: `Your Course Hub password reset code is ${resetToken}. It is valid for 15 minutes.`,
      },
      getEmailJsAuthOptions()
    );

    console.log(`[EmailJS] Password reset email sent to ${email}`);

    return { sent: true };
  } catch (error) {
    console.error('[EmailJS] Password reset email error:', error);
    throw error;
  }
};

module.exports = sendWelcomeEmail;
module.exports.sendWelcomeEmail = sendWelcomeEmail;
module.exports.sendVerificationEmail = sendWelcomeEmail;
module.exports.sendPasswordResetEmail = sendPasswordResetEmail;
