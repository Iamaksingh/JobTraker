// Redirect back to dashboard
document.getElementById('backToDashboard').addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});

// Load jobs on page load
document.addEventListener('DOMContentLoaded', fetchJobs);

// Function to fetch and render all job applications
async function fetchJobs() {
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
        <td><button class="delete-btn" data-id="${job._id}">Delete</button></td>
      `;
      tbody.appendChild(row);
    });

    attachDeleteListeners(); // 👈 Attach event listeners after DOM is updated
  } catch (err) {
    console.error('Error fetching jobs:', err);
    alert('Failed to load applications');
  }
}

// Attach delete listeners to each button
function attachDeleteListeners() {
  const deleteButtons = document.querySelectorAll('.delete-btn');

  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const jobId = btn.dataset.id;
      const token = localStorage.getItem('token');

      if (!confirm('Are you sure you want to delete this job?')) return;

      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          alert('Job deleted successfully');
          fetchJobs(); // 🔁 Refresh list
        } else {
          const errData = await res.json();
          alert(errData.message || 'Failed to delete job');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('An error occurred while deleting the job');
      }
    });
  });
}
