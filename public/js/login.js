                const contactInput = document.getElementById('contactInput');
                const submitButton = document.getElementById('submitButton');
                const contactError = document.getElementById('contactError');
                const passwordInput = document.getElementById("passwordInput");
                const showPasswordError = document.getElementById('showPasswordError');

                const emailRegex = /^[^\s@]+@[^\s@]+\.com$/; 
                const phoneRegex = /^\d{10}$/; 

                var isValid = false;
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            await loginUser(contactInput.value, passwordInput.value);
            });


                async function loginUser(contact, password) {
  const response = await fetch(`${window.location.origin}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contact, password }),
  credentials: 'include'
  });

  if (response.ok) {
    // Store token in localStorage
     alert('Login successful');
    window.location.href = '/profile';
  } else {
    const data = await response.text();
    alert('Login failed: ' + data);
    showPasswordError.innerHTML= data;
  }
}

    function notOnContact() {
                contactInput.classList.remove('invalidContact');
                contactError.classList.add('hiddenContactError');

    }
    function validateContact() {
                const value = contactInput.value.trim();
                isValid = emailRegex.test(value) || phoneRegex.test(value);

                if(!isValid){
                contactInput.classList.add('invalidContact');
                contactError.classList.remove('hiddenContactError');
                
                }
                else{
                contactInput.classList.remove('invalidContact');
                contactError.classList.add('hiddenContactError');
                
                }
                updateSubmitButton();
    }

        function updateSubmitButton(){
                if(isValid){
                submitButton.disabled = false;
                submitButton.classList.add('submit-btn');
                submitButton.classList.remove('submit-btn-disabled');
                }
                else{
                submitButton.disabled = true;
                submitButton.classList.remove('submit-btn');
                submitButton.classList.add('submit-btn-disabled');
                }
    }


