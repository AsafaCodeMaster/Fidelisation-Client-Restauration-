                const contactInput = document.getElementById('contactInput');
                const submitButton = document.getElementById('submitButton');
                const contactError = document.getElementById('contactError');
                const passwordInput = document.getElementById('passwordInput');
                const message = document.getElementById("passwordMessage");
                        // Regex pour valider un email
                const emailRegex = /^[^\s@]+@[^\s@]+\.com$/; 
                const phoneRegex = /^\d{10}$/; 

                var isValid = false;
                var isValidContact = false;
                var isValidPassword = false;
    function onNothing() {
        notOnContact();
        notOnPasswod();
    }
    function notOnContact() {
                contactInput.classList.remove('invalidContact');
                contactError.classList.add('hiddenContactError');

    }
    function notOnPassword() {
                message.style.display = "none";
                passwordInput.classList.remove('invalidContact');
    }
    function validateContact() {
                notOnPassword();

                const value = contactInput.value.trim();
                isValidContact = emailRegex.test(value) || phoneRegex.test(value);

                if(!isValidContact){
                contactInput.classList.add('invalidContact');
                contactError.classList.remove('hiddenContactError');
                
                }
                else{
                contactInput.classList.remove('invalidContact');
                contactError.classList.add('hiddenContactError');
                
                }
                updateSubmitButton();
    }
    function validatePassword(){
                notOnContact();
                const passwordValue = passwordInput.value;
                const rules = {
    length: passwordValue.length >= 8,
    lowercase: /[a-z]/.test(passwordValue),
    uppercase: /[A-Z]/.test(passwordValue),
    digit: /\d/.test(passwordValue),
    special: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`~;]/.test(passwordValue)
  };

                const passedRules = Object.values(rules).filter(v => v).length;
                let messageText = "<ul>";
                if (!rules.length) messageText += "<li>⚠️Au moins 8 caractères</li>";
                if (!rules.lowercase) messageText += "<li>⚠️Au moins une minuscule</li>";
                if (!rules.uppercase) messageText += "<li>⚠️Au moins une majuscule</li>";
                if (!rules.digit) messageText += "<li>⚠️Au moins un chiffre</li>";
                if (!rules.special) messageText += "<li>⚠️Au moins un caractère spécial</li>";
                messageText += "</ul>";

                if(passedRules === 5){
                        isValidPassword = true;
                        message.style.display = "none";
                        passwordInput.classList.remove('invalidContact');
                }
                else{
                        isValidPassword =false;                        
                        message.innerHTML = messageText;
                        message.style.display = "block";
                        passwordInput.classList.add('invalidContact');
                        
                }
        updateSubmitButton();
    }
    function updateSubmitButton(){
                isValid = isValidContact && isValidPassword;
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