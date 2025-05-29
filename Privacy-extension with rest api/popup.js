document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginSection = document.getElementById('login-section');
  const statusSection = document.getElementById('status-section');
  const logoutBtn = document.getElementById('logout-btn');
  const monitorBtn = document.getElementById('monitor-btn');
  const monitoringText = document.getElementById('monitoring-text');
  const themeToggle = document.getElementById('themeToggle');
  const toast = document.getElementById('toast');
  let monitoring = false;

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    themeToggle.textContent = document.body.classList.contains('light') ? '🌙' : '🌞';
  });

  // Show toast
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // Check auth on load
  chrome.storage.local.get('authToken', ({ authToken }) => {
    if (authToken) enterMonitoringUI();
  });

  // Login handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    if (!user || !pass) {
      showToast('Enter credentials');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: user, password: pass })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        chrome.storage.local.set({ authToken: data.token }, () => {
          showToast('Logged in');
          enterMonitoringUI();
        });
      } else {
        showToast(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast('Network or server error');
    }

    // Clear input fields after submission
    usernameInput.value = '';
    passwordInput.value = '';
  });

  // Enter monitoring UI
  function enterMonitoringUI() {
    loginSection.style.display = 'none';
    statusSection.style.display = 'flex';
    logoutBtn.style.display = 'inline-block';
  }

  // Logout handler
  logoutBtn.addEventListener('click', () => {
    chrome.storage.local.remove('authToken', () => {
      showToast('Logged out');
      monitoring = false;
      monitorBtn.textContent = 'Start Monitoring';
      monitoringText.textContent = 'Monitoring not started';
      statusSection.style.display = 'none';
      loginSection.style.display = 'flex';
      logoutBtn.style.display = 'none';
    });
  });

  // Monitoring toggle
  monitorBtn.addEventListener('click', () => {
    monitoring = !monitoring;
    monitorBtn.textContent = monitoring ? 'Stop Monitoring' : 'Start Monitoring';
    monitoringText.textContent = monitoring ? 'Monitoring started' : 'Monitoring not started';
    showToast(monitoring ? 'Monitoring started' : 'Monitoring stopped');
  });
});
