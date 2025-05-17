<script>
const API_URL = "http://localhost:5000/api";

function saveToken(token) { localStorage.setItem('token', token); }
function getToken() { return localStorage.getItem('token'); }
function removeToken() { localStorage.removeItem('token'); }

async function login(email, password) {
  const res = await fetch(API_URL + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    saveToken(data.token);
    showAvatar(data.user);
  } else {
    alert(data.msg);
  }
}

function showAvatar(user) {
  document.getElementById('profile-avatar').src = user.avatar || 'https://i.pravatar.cc/100';
  // Add click event to open profile modal and display/edit user info
}

// Attach login/signup form submit events, Google login button, etc.
// On page load, check if token exists, fetch & show profile avatar.
</script>
