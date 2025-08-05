document.getElementById('backToDashboard').addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Not logged in');
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/jobs', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jobs = await res.json();

    if (!Array.isArray(jobs)) {
      throw new Error('Unexpected response format');
    }

    const tbody = document.getElementById('jobTableBody');
    tbody.innerHTML = '';

    jobs.forEach((job) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${job.companyName}</td>
        <td>${job.role}</td>
        <td>${job.status}</td>
        <td>${job.source}</td>
        <td><a href="${job.jdLink}" target="_blank">Link</a></td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    alert('Failed to load applications');
  }
});
