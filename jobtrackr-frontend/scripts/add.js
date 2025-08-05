const form = document.getElementById('applicationForm');
document.getElementById('backToDashboard').addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login again');
    return (window.location.href = 'index.html');
  }

  const data = {
    companyName: document.getElementById('company').value.trim(),
    role: document.getElementById('role').value.trim(),
    status: document.getElementById('status').value,
    source: document.getElementById('source').value.trim(),
    jdLink: document.getElementById('jdLink').value.trim(),
  };
  console.log('Submitting:', data);
  try {
    const res = await fetch('https://jobtraker-x8xq.onrender.com/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      const msg = document.getElementById('successMessage');
      msg.textContent = '✅ Application added!';
      msg.style.display = 'block';
    } else {
      alert(result.message || 'Failed to save application');
    }
  } catch (err) {
    console.error('Error saving application:', err);
    alert('Server error');
  }
});
