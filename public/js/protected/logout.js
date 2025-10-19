    document.getElementById("logoutForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            await logoutUser();
            });


async function logoutUser() {
    
    const response = await fetch('http://localhost:3000/logout', {
  method: 'POST',
  credentials: 'include'
});

}