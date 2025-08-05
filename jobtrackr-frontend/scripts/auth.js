const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

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
    console.log('Response:', res.status, data);  // 👈 Add this line

    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    console.error('Fetch failed:', err);  // 👈 Add this line
    alert('Server error');
  }
});
