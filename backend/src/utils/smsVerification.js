const TWILIO_VERIFY_BASE_URL = 'https://verify.twilio.com/v2/Services';

function isSmsVerificationConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_VERIFY_SERVICE_SID
  );
}

function getTwilioAuthHeader() {
  const credentials = `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
}

async function postVerifyRequest(resource, values) {
  if (!isSmsVerificationConfigured()) {
    throw new Error('SMS verification is not configured. Set the Twilio Verify environment variables.');
  }

  const response = await fetch(
    `${TWILIO_VERIFY_BASE_URL}/${encodeURIComponent(process.env.TWILIO_VERIFY_SERVICE_SID)}/${resource}`,
    {
      method: 'POST',
      headers: {
        Authorization: getTwilioAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(values),
    }
  );

  if (!response.ok) {
    // Do not log or return Twilio response bodies; they may contain phone numbers.
    throw new Error('The SMS verification provider could not process the request.');
  }

  return response.json();
}

async function sendSmsVerification(phoneNumber) {
  const result = await postVerifyRequest('Verifications', {
    To: phoneNumber,
    Channel: 'sms',
  });
  return result.status === 'pending';
}

async function checkSmsVerification(phoneNumber, code) {
  const result = await postVerifyRequest('VerificationCheck', {
    To: phoneNumber,
    Code: code,
  });
  return result.status === 'approved';
}

module.exports = {
  isSmsVerificationConfigured,
  sendSmsVerification,
  checkSmsVerification,
};
