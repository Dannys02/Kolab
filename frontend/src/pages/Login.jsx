
const handleLogin = async () => {
  const res = await fetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem('token', data.token);
    navigate('/dashboard');
  }
};
