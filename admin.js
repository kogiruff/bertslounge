const state = { credential: null, email: null, isOpen: false };
const loginPanel = document.getElementById('login-panel');
const adminPanel = document.getElementById('admin-panel');
const messageBox = document.getElementById('message');
const statusText = document.getElementById('status-text');
const adminEmail = document.getElementById('admin-email');
const toggleInput = document.getElementById('commission-toggle');
const toggleLabel = document.getElementById('toggle-label');
const saveStatusButton = document.getElementById('save-status');
const logoutButton = document.getElementById('logout-btn');

let toastTimeout; // Timeout reference untuk popup toast

// Logika Toast 2 detik
function setMessage(type, text) { 
  messageBox.className = `toast ${type}`; 
  messageBox.textContent = text; 
  
  // Force browser reflow untuk me-reset animasi CSS
  void messageBox.offsetWidth;

  messageBox.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    messageBox.classList.remove('show');
  }, 2000);
}

function clearMessage() { 
  messageBox.className = 'toast'; 
  messageBox.textContent = ''; 
  messageBox.classList.remove('show');
}

function showAdminPanel() { loginPanel.classList.add('hidden'); adminPanel.classList.remove('hidden'); }
function showLoginPanel() { loginPanel.classList.remove('hidden'); adminPanel.classList.add('hidden'); }

// Update UI toggle text & colors
function updateToggleUI() { 
  toggleInput.checked = state.isOpen; 
  if (state.isOpen) {
    toggleLabel.textContent = 'Opened'; 
    toggleLabel.className = 'status-opened';
  } else {
    toggleLabel.textContent = 'Closed'; 
    toggleLabel.className = 'status-closed';
  }
}

async function readJson(response) { const payload = await response.json(); if (!response.ok) throw new Error(payload.error || 'The request failed.'); return payload; }

async function loadCurrentStatus() {
  const payload = await readJson(await fetch('/api/commission-status', { cache: 'no-store' }));
  state.isOpen = payload.open === true; updateToggleUI();
  // Status text disembunyikan di HTML, tapi fungsionalitas ini tetap dibiarkan agar tidak mengganggu logic lain
  statusText.textContent = state.isOpen ? 'Open for commissions.' : 'Closed for commissions.';
}

async function verifyAdminToken(credential) {
  const payload = await readJson(await fetch('/api/admin/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential }) }));
  return payload.email;
}

async function handleCredentialResponse(response) {
  if (!response.credential) return setMessage('error', 'Google sign-in did not return a credential.');
  try {
    state.credential = response.credential; state.email = await verifyAdminToken(state.credential);
    adminEmail.textContent = state.email; showAdminPanel(); await loadCurrentStatus(); clearMessage();
  } catch (error) { state.credential = null; showLoginPanel(); setMessage('error', error.message); }
}

async function saveStatus() {
  if (!state.credential) return setMessage('error', 'Please sign in first.');
  saveStatusButton.disabled = true;
  try {
    const payload = await readJson(await fetch('/api/admin/update-status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential: state.credential, open: toggleInput.checked }) }));
    state.isOpen = payload.open === true; updateToggleUI();
    statusText.textContent = state.isOpen ? 'Open for commissions.' : 'Closed for commissions.';
    
    // Teks popup disesuaikan dengan permintaan
    setMessage('success', '✓ Successfully Saved');
  } catch (error) { setMessage('error', error.message); } finally { saveStatusButton.disabled = false; }
}

function logout() { state.credential = null; state.email = null; state.isOpen = false; adminEmail.textContent = '—'; showLoginPanel(); clearMessage(); window.google?.accounts.id.disableAutoSelect(); }

function waitForGoogleIdentity() {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + 10_000;
    const timer = setInterval(() => {
      if (window.google?.accounts?.id) { clearInterval(timer); resolve(); }
      if (Date.now() > deadline) { clearInterval(timer); reject(new Error('Google Identity Services could not load.')); }
    }, 50);
  });
}

async function init() {
  try {
    const { clientId } = await readJson(await fetch('/api/admin/config', { cache: 'no-store' }));
    await waitForGoogleIdentity();
    window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredentialResponse });
    window.google.accounts.id.renderButton(document.getElementById('google-signin'), { theme: 'outline', size: 'large', width: 300, text: 'signin_with' });
    saveStatusButton.addEventListener('click', saveStatus);
    logoutButton.addEventListener('click', logout);
    toggleInput.addEventListener('change', () => { state.isOpen = toggleInput.checked; updateToggleUI(); });
  } catch (error) { setMessage('error', error.message); }
}

init();