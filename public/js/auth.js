const API_URL = "http://localhost:5000/api";

function saveToken(token) { localStorage.setItem('token', token); }
function getToken() { return localStorage.getItem('token'); }
function removeToken() { localStorage.removeItem('token'); }

async function login(email, password) {
  try {
    const res = await fetch(API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      saveToken(data.token);
      showAvatar(data.user);
      window.location.href = "/nextpage.html";
    } else {
      alert(data.msg || "Login failed");
    }
  } catch (err) {
    alert("Network error");
  }
}

function showAvatar(user) {
  const avatar = document.getElementById('profile-avatar');
  if (avatar) {
    avatar.src = user.avatar || 'https://i.pravatar.cc/100';
  }
}

// Example event attachment for login form
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;
      login(email, password);
    });
  }
});

// TODO: Add register, Google OAuth, logout as needed
