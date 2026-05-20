// ==============================
// LUXE — Auth (Login / Register)
// ==============================

// Demo credentials
const DEMO_USER = { email: 'demo@luxe.com', password: 'demo1234', name: 'Demo User' };
const USERS_KEY = 'luxe_users';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [DEMO_USER]; }
  catch { return [DEMO_USER]; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(user) {
  localStorage.setItem('luxe_session', JSON.stringify({ email: user.email, name: user.name, loggedIn: true }));
}

// ===== TAB SWITCHING =====
document.getElementById('loginTab')?.addEventListener('click', () => switchTab('login'));
document.getElementById('registerTab')?.addEventListener('click', () => switchTab('register'));
document.getElementById('goRegister')?.addEventListener('click', () => switchTab('register'));
document.getElementById('goLogin')?.addEventListener('click', () => switchTab('login'));

function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
  }
}

// ===== PASSWORD TOGGLE =====
document.getElementById('toggleLoginPwd')?.addEventListener('click', () => {
  const input = document.getElementById('loginPassword');
  input.type = input.type === 'password' ? 'text' : 'password';
});

document.getElementById('toggleRegPwd')?.addEventListener('click', () => {
  const input = document.getElementById('regPassword');
  input.type = input.type === 'password' ? 'text' : 'password';
});

// ===== PASSWORD STRENGTH =====
document.getElementById('regPassword')?.addEventListener('input', e => {
  const val = e.target.value;
  const bar = document.getElementById('pwBar');
  if (!bar) return;
  let strength = 0;
  if (val.length >= 8) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++;
  const pct = (strength / 4) * 100;
  bar.style.width = pct + '%';
  bar.style.background = strength <= 1 ? 'var(--red)' : strength === 2 ? '#ff9800' : strength === 3 ? '#ffc107' : 'var(--green)';
});

// ===== VALIDATION =====
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors(...ids) {
  ids.forEach(id => showError(id, ''));
}

function setFieldError(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (input) input.classList.toggle('error', !!msg);
  if (err) err.textContent = msg || '';
}

// ===== LOGIN =====
document.getElementById('loginForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const msgEl = document.getElementById('loginMsg');

  clearErrors('loginEmailErr', 'loginPwdErr');
  let valid = true;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    setFieldError('loginEmail', 'loginEmailErr', 'Please enter a valid email address.');
    valid = false;
  }
  if (!password || password.length < 6) {
    setFieldError('loginPassword', 'loginPwdErr', 'Password must be at least 6 characters.');
    valid = false;
  }
  if (!valid) return;

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    msgEl.className = 'field-group error';
    msgEl.textContent = 'Invalid email or password. Try demo@luxe.com / demo1234';
    msgEl.style.display = 'block';
    return;
  }

  msgEl.className = 'field-group success';
  msgEl.textContent = `Welcome back, ${user.name || 'friend'}! Redirecting…`;
  msgEl.style.display = 'block';

  setSession(user);

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1200);
});

// ===== REGISTER =====
document.getElementById('registerForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const first = document.getElementById('regFirst').value.trim();
  const last = document.getElementById('regLast').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  const agree = document.getElementById('agreeTerms').checked;
  const msgEl = document.getElementById('registerMsg');

  clearErrors('regFirstErr', 'regEmailErr', 'regPwdErr', 'regConfirmErr');
  let valid = true;

  if (!first) {
    setFieldError('regFirst', 'regFirstErr', 'First name is required.');
    valid = false;
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    setFieldError('regEmail', 'regEmailErr', 'Please enter a valid email address.');
    valid = false;
  }
  if (password.length < 8) {
    setFieldError('regPassword', 'regPwdErr', 'Password must be at least 8 characters.');
    valid = false;
  }
  if (password !== confirm) {
    setFieldError('regConfirm', 'regConfirmErr', 'Passwords do not match.');
    valid = false;
  }
  if (!agree) {
    msgEl.className = 'field-group error';
    msgEl.textContent = 'You must agree to the Terms of Service.';
    msgEl.style.display = 'block';
    valid = false;
  }
  if (!valid) return;

  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    setFieldError('regEmail', 'regEmailErr', 'An account with this email already exists.');
    return;
  }

  const newUser = { email, password, name: `${first} ${last}`.trim() };
  users.push(newUser);
  saveUsers(users);
  setSession(newUser);

  msgEl.className = 'field-group success';
  msgEl.textContent = `Account created! Welcome, ${first}! Redirecting…`;
  msgEl.style.display = 'block';

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1200);
});

// ===== CHECK SESSION =====
// If already logged in, show account info
const session = JSON.parse(localStorage.getItem('luxe_session') || 'null');
if (session?.loggedIn) {
  const loginMsg = document.getElementById('loginMsg');
  if (loginMsg) {
    loginMsg.className = 'field-group success';
    loginMsg.textContent = `You're already logged in as ${session.name || session.email}.`;
    loginMsg.style.display = 'block';
  }
}
