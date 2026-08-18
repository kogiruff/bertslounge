const { authenticateAdmin } = require('../_lib/admin-auth');
const { applyApiHeaders, handleOptions } = require('../_lib/http');

module.exports = async function handler(req, res) {
  applyApiHeaders(res, 'POST, OPTIONS');
  if (handleOptions(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  try {
    const email = await authenticateAdmin(req.body?.credential);
    return res.status(200).json({ ok: true, email });
  } catch (error) {
    const statusCode = error.statusCode || (error.message.startsWith('Server configuration') ? 500 : 401);
    return res.status(statusCode).json({ ok: false, error: error.message });
  }
};
