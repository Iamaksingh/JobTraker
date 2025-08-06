const token = localStorage.getItem('token');
const res = await fetch('https://jobtraker-x8xq.onrender.com/api/profile', {
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
    const res = await fetch('https://jobtraker-x8xq.onrender.com/api/profile', {
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

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');

  fetch('/api/jobs/analytics', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('total-count').textContent = data.total;
      document.getElementById('applied-count').textContent = data.breakdown.Applied || 0;
      document.getElementById('interview-count').textContent = data.breakdown.Interview || 0;
      document.getElementById('rejected-count').textContent = data.breakdown.Rejected || 0;
    })
    .catch(err => {
      console.error('Error fetching analytics:', err);
    });
});
