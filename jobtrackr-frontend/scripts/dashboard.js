document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Please login first');
    window.location.href = 'index.html';
    return;
  }

  loadProfile(token);
  fetchAnalytics(token);
});

// ✅ Function to fetch and display job analytics
function fetchAnalytics(token) {
  fetch('https://jobtraker-x8xq.onrender.com/api/jobs/analytics', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    })
    .then(data => {
      console.log('Analytics:', data); // Debugging
      document.getElementById('total-count').textContent = data.total;
      document.getElementById('applied-count').textContent = data.breakdown.Applied || 0;
      document.getElementById('interview-count').textContent = data.breakdown.Interview || 0;
      document.getElementById('rejected-count').textContent = data.breakdown.Rejected || 0;
    })
    .catch(err => {
      console.error('Error fetching analytics:', err);
    });
}

// ✅ Function to load and display user profile
async function loadProfile(token) {
  const welcomeMsg = document.getElementById('welcomeMsg');

  try {
    const res = await fetch('https://jobtraker-x8xq.onrender.com/api/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
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

// ✅ Logout button functionality
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');

  fetch('https://jobtraker-x8xq.onrender.com/api/jobs/analytics', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const applied = data.breakdown.Applied || 0;
      const interview = data.breakdown.Interview || 0;
      const rejected = data.breakdown.Rejected || 0;

      // Show total stats
      document.getElementById('total-count').textContent = data.total;
      document.getElementById('applied-count').textContent = applied;
      document.getElementById('interview-count').textContent = interview;
      document.getElementById('rejected-count').textContent = rejected;

      // Create Pie Chart
      const ctx = document.getElementById('statusPieChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Applied', 'Interview', 'Rejected'],
          datasets: [{
            label: 'Application Status',
            data: [applied, interview, rejected],
            backgroundColor: ['#36A2EB', 'lightgreen', '#FF6384'],
            borderColor: ['#fff', '#fff', '#fff'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'Application Status Breakdown'
            }
          }
        }
      });
    })
    .catch(err => {
      console.error('Error fetching analytics:', err);
    });
});
