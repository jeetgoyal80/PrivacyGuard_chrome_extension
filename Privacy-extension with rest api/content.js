// consentSync.js

const seen = new Set();

// Promisified storage helpers
const storageGet = (keys) =>
  new Promise((resolve) => chrome.storage.local.get(keys, resolve));
const storageSet = (obj) =>
  new Promise((resolve) => chrome.storage.local.set(obj, resolve));

// Load all existing consents from backend on startup and cache them locally
async function initializeConsents() {
  const { authToken } = await storageGet(['authToken']);
  if (!authToken) return;  // No token => no fetch

  try {
    const res = await fetch('http://localhost:8000/api/consent/my-consents', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const consents = await res.json();
    await storageSet({ consents });
    console.log('[INIT] Cached consents:', consents);
  } catch (err) {
    console.error('[INIT] Could not load consents:', err);
  }
}

// Call on load
initializeConsents();

// Listen for permission-use messages from injected page script
window.addEventListener('message', async (e) => {
  if (e.source !== window || e.data?.source !== 'privacy-guard') return;

  const { origin, perm, state = 'granted' } = e.data;
  const key = `${origin}|${perm}|${state}`;

  if (seen.has(key)) {
    // Already processed this exact update
    return;
  }
  seen.add(key);

  // Update local cached permissions for this origin
  const siteList = (await storageGet([origin]))[origin] || [];
  const newList =
    state === 'granted'
      ? Array.from(new Set([...siteList, perm]))
      : siteList.filter((p) => p !== perm);
  await storageSet({ [origin]: newList });

  // Send to backend only if permission state changed compared to cached consents
  const { authToken, consents = [] } = await storageGet(['authToken', 'consents']);
  if (!authToken) return;

  // Find existing consent record for this origin/service
  const match = consents.find((c) => c.service === origin);

  // Check if this permission's state is already recorded the same in cached consents
  if (match) {
    const recordedEntry = match.dataShared.find((entry) => entry.permission === perm);
    if (recordedEntry && recordedEntry.granted === (state === 'granted')) {
      // Permission state unchanged — skip sending to backend
      console.log(`[SKIP] Permission state unchanged for ${perm} on ${origin}`);
      return;
    }
  }

  // Determine REST endpoint and method
  const urlPath = match ? `/api/consent/update/${match._id}` : '/api/consent/log';
  const method = match ? 'PUT' : 'POST';

  const payload = {
    service: origin,
    dataShared: [{ permission: perm, granted: state === 'granted' }],
    consentGiven: state === 'granted',
  };

  try {
    const res = await fetch(`http://localhost:8000${urlPath}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok) {
      if (!match && result.consent) {
        // New consent created — add to local cache
        const updated = [...consents, result.consent];
        await storageSet({ consents: updated });
        console.log('[POST] Cached new consent:', result.consent);
      } else if (match) {
        // Existing consent updated — update cache
        const updatedConsent = result.updated || result;
        const updated = consents.map((c) =>
          c._id === match._id ? updatedConsent : c
        );
        await storageSet({ consents: updated });
        console.log('[PUT] Updated consent cache:', match._id);
      }
    } else {
      console.warn('[BACKEND] Unexpected response:', result);
    }
  } catch (err) {
    console.error('[BACKEND] Request error:', err);
  }
});
