const { authenticateAdmin } = require('../_lib/admin-auth');
const { setCommissionStatus } = require('../_lib/commission-store');
const { applyApiHeaders, handleOptions } = require('../_lib/http');

module.exports = async function handler(req, res) {
  applyApiHeaders(res, 'POST, OPTIONS');
  if (handleOptions(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  if (typeof req.body?.open !== 'boolean') return res.status(400).json({ ok: false, error: 'open must be a boolean.' });
  try {
    const email = await authenticateAdmin(req.body.credential);
    const status = await setCommissionStatus(req.body.open, email);
    return res.status(200).json({ ok: true, ...status });
  } catch (error) {
    const statusCode = error.statusCode || (error.message.startsWith('Could not') ? 502 : error.message.startsWith('Server configuration') ? 500 : 401);
    return res.status(statusCode).json({ ok: false, error: error.message });
  }
};
