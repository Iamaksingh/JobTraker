const loginForm = document.getElementById('loginForm');
const loadingSpinner = document.getElementById('loading-spinner');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loadingSpinner.style.display = 'flex';
  loginForm.style.display = 'none';
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  console.log(JSON.stringify({ email, password }))
  try {
    const res = await fetch('https://jobtraker-x8xq.onrender.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    alert('Server error');
  }
  loadingSpinner.style.display = 'none';
  loginForm.style.display = 'block';
});
