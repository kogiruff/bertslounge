const { getRequiredEnv } = require('./env');

function getAllowedAdminEmails() {
  return (process.env.ALLOWED_ADMIN_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
}

async function authenticateAdmin(credential) {
  if (!credential || typeof credential !== 'string') throw new Error('Missing Google credential.');
  const clientId = getRequiredEnv('GOOGLE_CLIENT_ID');
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
  if (!response.ok) throw new Error('Invalid Google credential.');
  const payload = await response.json();
  const validIssuer = payload.iss === 'accounts.google.com' || payload.iss === 'https://accounts.google.com';
  const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
  if (!validIssuer || payload.aud !== clientId || payload.email_verified !== 'true' || !email) throw new Error('Invalid Google credential.');
  if (!getAllowedAdminEmails().includes(email)) {
    const error = new Error('This Google account is not allowed to administer commissions.');
    error.statusCode = 403;
    throw error;
  }
  return email;
}

module.exports = { authenticateAdmin };
