const token = localStorage.getItem('token');
const res = await fetch('http://localhost:5000/api/profile', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const welcomeMsg = document.getElementById('welcomeMsg');
const logoutBtn = document.getElementById('logoutBtn');

if (!token) {
  alert('Please login first');
  window.location.href = 'index.html';
}

// Fetch user info from backend
async function loadProfile() {
  try {
    const res = await fetch('http://localhost:5000/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      welcomeMsg.textContent = `Welcome, ${data.user.name}!`;
    } else {
      alert(data.message || 'Session expired');
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    }
  } catch (err) {
    console.error('Profile fetch failed:', err);
    alert('Error fetching profile');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
}

loadProfile();

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});
