const { getRequiredEnv } = require('./env');

function getSupabaseConfig() {
  return { url: getRequiredEnv('SUPABASE_URL').replace(/\/$/, ''), key: getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY') };
}
function headers(key, extra = {}) { return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...extra }; }

async function getCommissionStatus() {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/commission_config?key=eq.open&select=value,updated_at&limit=1`, { headers: headers(key) });
  if (!response.ok) throw new Error('Could not read commission status from Supabase.');
  const [row] = await response.json();
  return row ? { open: row.value === 'true', updatedAt: row.updated_at } : null;
}

async function setCommissionStatus(open, updatedBy) {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/commission_config?on_conflict=key`, {
    method: 'POST', headers: headers(key, { Prefer: 'resolution=merge-duplicates,return=representation' }),
    body: JSON.stringify({ key: 'open', value: String(open), updated_by: updatedBy, updated_at: new Date().toISOString() })
  });
  if (!response.ok) throw new Error('Could not save commission status to Supabase.');
  const [row] = await response.json();
  return { open: row.value === 'true', updatedAt: row.updated_at };
}
module.exports = { getCommissionStatus, setCommissionStatus };
