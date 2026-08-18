const { getCommissionStatus } = require('./_lib/commission-store');
const { applyApiHeaders, handleOptions } = require('./_lib/http');

module.exports = async function handler(req, res) {
  applyApiHeaders(res, 'GET, OPTIONS');
  if (handleOptions(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
  try {
    const status = await getCommissionStatus();
    const formsLink = process.env.FORMS_LINK || null;
    if (status) return res.status(200).json({ ...status, formsLink, source: 'supabase' });
    return res.status(200).json({ open: false, updatedAt: null, formsLink, source: 'default' });
  } catch (error) {
    console.error('Commission status lookup failed:', error.message);
    return res.status(503).json({ open: false, error: 'Commission status is temporarily unavailable.' });
  }
};
