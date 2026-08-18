function applyApiHeaders(res, methods) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function handleOptions(req, res) {
  if (req.method !== 'OPTIONS') return false;
  res.status(204).end();
  return true;
}

module.exports = { applyApiHeaders, handleOptions };
