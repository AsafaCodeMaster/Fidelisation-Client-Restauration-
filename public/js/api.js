async function loadProtectedPage() {
  const token = localStorage.getItem('token');

  // 1. Check if token exists
  if (!token) {
    alert("You need to login first.");
    window.location.href = '/login';
    return;
  }

  try {
    // 2. Send the fetch with Authorization header
    const response = await fetch('/profile', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    // 3. If response is OK, get HTML and display it
    if (response.ok) {
      const html = await response.text();
document.documentElement.innerHTML = html;
    } else {
      // 4. Token invalid or expired
      localStorage.removeItem('token');
      alert('Session expired or unauthorized. Please login again.');
      window.location.href = '/login';
    }

  } catch (error) {
    console.error('Error while fetching protected page:', error);
    alert('Something went wrong. Please try again.');
    window.location.href = '/login';
  }
}

// 5. Call function when page loads
window.addEventListener('load', loadProtectedPage);