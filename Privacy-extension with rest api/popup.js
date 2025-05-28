const loginForm = document.getElementById('login-form');
const loginStatus = document.getElementById('login-status');
const loginSection = document.getElementById('login-section');
const statusSection = document.getElementById('status-section');
const logoutBtn = document.getElementById('logout-btn');
const permissionsList = document.getElementById('permissions-used');

// Check login state and display the correct section
async function checkLoggedIn() {
  const data = await chrome.storage.local.get(['authToken']);
  if (data.authToken) {
    loginSection.style.display = 'none';
    statusSection.style.display = 'block';
    loadPermissions();
  } else {
    loginSection.style.display = 'block';
    statusSection.style.display = 'none';
    permissionsList.innerHTML = '';
  }
}

// Handle login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginStatus.textContent = '';
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    if (data.token) {
      await chrome.storage.local.set({ authToken: data.token });
      loginStatus.style.color = 'green';
      loginStatus.textContent = 'Login successful!';
      checkLoggedIn();
    } else {
      loginStatus.style.color = 'red';
      loginStatus.textContent = 'No token received';
    }
  } catch (err) {
    loginStatus.style.color = 'red';
    loginStatus.textContent = 'Login error: ' + err.message;
  }
});

// Handle logout
logoutBtn.addEventListener('click', async () => {
  await chrome.storage.local.remove('authToken');
  checkLoggedIn();
});

// Load permissions used on the current active tab
function loadPermissions() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url) return;
    const origin = new URL(tab.url).origin;
    chrome.storage.local.get([origin], (data) => {
      const used = data[origin] || [];
      permissionsList.innerHTML = '';
      used.forEach((perm) => {
        const li = document.createElement('li');
        li.textContent = perm;
        permissionsList.appendChild(li);
      });
    });
  });
}

// Refresh the list when tab is activated or updated
document.addEventListener('DOMContentLoaded', checkLoggedIn);
chrome.tabs.onActivated.addListener(checkLoggedIn);
chrome.tabs.onUpdated.addListener(checkLoggedIn);

// NEW: Refresh the list when storage changes (live tracking)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.url) return;
      const origin = new URL(tab.url).origin;
      if (changes[origin]) {
        loadPermissions();
      }
    });
  }
});
