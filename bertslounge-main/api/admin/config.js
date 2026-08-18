const { applyApiHeaders, handleOptions } = require('../_lib/http');
module.exports = function handler(req, res) {
  applyApiHeaders(res, 'GET, OPTIONS');
  if (handleOptions(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
  if (!process.env.GOOGLE_CLIENT_ID) return res.status(503).json({ error: 'Google sign-in is not configured.' });
  return res.status(200).json({ clientId: process.env.GOOGLE_CLIENT_ID });
};
