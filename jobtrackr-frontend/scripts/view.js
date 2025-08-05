function showConfirmDialog(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const yesBtn = document.getElementById('confirmYes');
    const noBtn = document.getElementById('confirmNo');

    confirmMessage.textContent = message;
    modal.classList.remove('hidden');

    const cleanup = () => {
      modal.classList.add('hidden');
      yesBtn.removeEventListener('click', onYes);
      noBtn.removeEventListener('click', onNo);
    };

    const onYes = () => {
      cleanup();
      resolve(true);
    };

    const onNo = () => {
      cleanup();
      resolve(false);
    };

    yesBtn.addEventListener('click', onYes);
    noBtn.addEventListener('click', onNo);
  });
}

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
    showToast('Failed to load applications', 'error');
  }
}

// Attach delete listeners to each button
function attachDeleteListeners() {
  const deleteButtons = document.querySelectorAll('.delete-btn');

  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const jobId = btn.dataset.id;
      const token = localStorage.getItem('token');

      const confirmed = await showConfirmDialog('Are you sure you want to delete this job?');
      if (!confirmed) return;

      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          showToast('Job deleted successfully', 'success');
          fetchJobs(); // 🔁 Refresh list
        } else {
          const errData = await res.json();
          alert(errData.message || 'Failed to delete job');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        showToast(errData.message || 'Failed to delete job', 'error');
      }
    });
  });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => container.removeChild(toast), 500);
  }, 3000);
}