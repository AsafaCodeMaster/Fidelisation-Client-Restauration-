// Change Password Page JavaScript

// Password requirements regex
const passwordRequirements = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
};

// DOM Elements
const changePasswordForm = document.getElementById('changePasswordForm');
const currentPassword = document.getElementById('currentPassword');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const passwordMatch = document.getElementById('passwordMatch');
const requirementsList = document.getElementById('requirementsList');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupTogglePassword();
    setupPasswordValidation();
    setupFormSubmission();
    console.log('✅ Change password page initialized');
});

// Setup toggle password visibility
function setupTogglePassword() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const input = document.getElementById(targetId);
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'bi bi-eye-slash';
                button.classList.add('active');
            } else {
                input.type = 'password';
                icon.className = 'bi bi-eye';
                button.classList.remove('active');
            }
        });
    });
}

// Setup password validation
function setupPasswordValidation() {
    if (!newPassword) return;
    
    // Real-time validation on new password
    newPassword.addEventListener('input', () => {
        validateNewPassword();
        checkPasswordMatch();
        validateForm();
    });
    
    // Check password match on confirm password input
    if (confirmPassword) {
        confirmPassword.addEventListener('input', () => {
            checkPasswordMatch();
            validateForm();
        });
    }
    
    // Validate current password
    if (currentPassword) {
        currentPassword.addEventListener('input', validateForm);
    }
}

// Validate new password against requirements
function validateNewPassword() {
    const password = newPassword.value;
    const requirements = {
        length: passwordRequirements.length.test(password),
        uppercase: passwordRequirements.uppercase.test(password),
        lowercase: passwordRequirements.lowercase.test(password),
        number: passwordRequirements.number.test(password),
        special: passwordRequirements.special.test(password)
    };
    
    // Update requirements list
    Object.keys(requirements).forEach(key => {
        const item = document.querySelector(`[data-requirement="${key}"]`);
        if (item) {
            if (requirements[key]) {
                item.classList.add('valid');
            } else {
                item.classList.remove('valid');
            }
        }
    });
    
    // Calculate password strength
    const satisfiedCount = Object.values(requirements).filter(Boolean).length;
    updatePasswordStrength(satisfiedCount, password.length);
    
    // Update input border
    const allValid = Object.values(requirements).every(Boolean);
    if (password.length > 0) {
        if (allValid) {
            newPassword.classList.add('valid');
            newPassword.classList.remove('invalid');
        } else {
            newPassword.classList.add('invalid');
            newPassword.classList.remove('valid');
        }
    } else {
        newPassword.classList.remove('valid', 'invalid');
    }
    
    return allValid;
}

// Update password strength indicator
function updatePasswordStrength(satisfiedCount, length) {
    if (!strengthFill || !strengthText) return;
    
    if (length === 0) {
        strengthFill.className = 'strength-fill';
        strengthText.textContent = 'Aucun mot de passe';
        strengthText.className = 'strength-text';
        return;
    }
    
    if (satisfiedCount <= 2) {
        strengthFill.className = 'strength-fill weak';
        strengthText.textContent = 'Faible';
        strengthText.className = 'strength-text weak';
    } else if (satisfiedCount <= 4) {
        strengthFill.className = 'strength-fill medium';
        strengthText.textContent = 'Moyen';
        strengthText.className = 'strength-text medium';
    } else {
        strengthFill.className = 'strength-fill strong';
        strengthText.textContent = 'Fort';
        strengthText.className = 'strength-text strong';
    }
}

// Check if passwords match
function checkPasswordMatch() {
    if (!confirmPassword || !passwordMatch) return false;
    
    const newPass = newPassword.value;
    const confirmPass = confirmPassword.value;
    
    if (confirmPass.length === 0) {
        passwordMatch.textContent = '';
        passwordMatch.className = 'password-match';
        confirmPassword.classList.remove('valid', 'invalid');
        return false;
    }
    
    if (newPass === confirmPass) {
        passwordMatch.innerHTML = '<i class="bi bi-check-circle-fill"></i> Les mots de passe correspondent';
        passwordMatch.className = 'password-match match';
        confirmPassword.classList.add('valid');
        confirmPassword.classList.remove('invalid');
        return true;
    } else {
        passwordMatch.innerHTML = '<i class="bi bi-x-circle-fill"></i> Les mots de passe ne correspondent pas';
        passwordMatch.className = 'password-match no-match';
        confirmPassword.classList.add('invalid');
        confirmPassword.classList.remove('valid');
        return false;
    }
}

// Validate entire form
function validateForm() {
    if (!submitBtn) return;
    
    const currentPass = currentPassword ? currentPassword.value.trim() : '';
    const newPass = newPassword ? newPassword.value : '';
    const confirmPass = confirmPassword ? confirmPassword.value : '';
    
    // Check all conditions
    const hasCurrentPassword = currentPass.length > 0;
    const newPasswordValid = validateNewPassword();
    const passwordsMatch = newPass === confirmPass && confirmPass.length > 0;
    
    const isValid = hasCurrentPassword && newPasswordValid && passwordsMatch;
    
    submitBtn.disabled = !isValid;
}

// Alert function
function showAlert(type, message, duration = 5000) {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = 'alert-' + Date.now();
    
    const icons = {
        success: 'check-circle-fill',
        danger: 'exclamation-triangle-fill',
        warning: 'exclamation-circle-fill',
        info: 'info-circle-fill'
    };
    
    const alertHtml = `
        <div class="alert alert-${type}" id="${alertId}">
            <i class="bi bi-${icons[type]}"></i>
            <span>${message}</span>
            <button class="alert-close" onclick="closeAlert('${alertId}')">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHtml);
    
    setTimeout(() => {
        closeAlert(alertId);
    }, duration);
}

function closeAlert(alertId) {
    const alert = document.getElementById(alertId);
    if (alert) {
        alert.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }
}

// Form submission
function setupFormSubmission() {
    if (!changePasswordForm) return;
    
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (submitBtn.disabled) {
            showAlert('warning', 'Veuillez remplir tous les champs correctement.');
            return;
        }
        
        // Get values
        const currentPass = currentPassword.value.trim();
        const newPass = newPassword.value;
        const confirmPass = confirmPassword.value;
        
        // Final validation
        if (newPass !== confirmPass) {
            showAlert('danger', 'Les mots de passe ne correspondent pas.');
            return;
        }
        
        if (currentPass === newPass) {
            showAlert('warning', 'Le nouveau mot de passe doit être différent de l\'ancien.');
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Changement en cours...';
        submitBtn.disabled = true;
        
        try {
            // Submit to API
            const response = await fetch('/api/password/change', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: currentPass,
                    newPassword: newPass
                })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Show success modal
                showSuccessModal();
                
                // Track event
                console.log('✅ Password changed successfully');
                
            } else {
                // Show error
                const errorMessage = result.message || 'Erreur lors du changement de mot de passe.';
                showAlert('danger', errorMessage);
                
                // Common error handling
                if (result.error === 'INCORRECT_PASSWORD') {
                    currentPassword.classList.add('invalid');
                    currentPassword.focus();
                }
                
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            showAlert('danger', 'Erreur de connexion. Veuillez réessayer.');
            
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Prevent form resubmission
        if (changePasswordForm) {
            changePasswordForm.reset();
        }
    }
}

// Cancel button
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        const hasChanges = currentPassword.value.length > 0 || 
                          newPassword.value.length > 0 || 
                          confirmPassword.value.length > 0;
        
        if (hasChanges) {
            if (confirm('Êtes-vous sûr de vouloir annuler ? Les modifications seront perdues.')) {
                history.back();
            }
        } else {
            history.back();
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (submitBtn && !submitBtn.disabled) {
            changePasswordForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to cancel
    if (e.key === 'Escape') {
        const modal = document.getElementById('successModal');
        if (modal && modal.style.display === 'flex') {
            // Don't close success modal with Escape
            return;
        }
        if (cancelBtn) cancelBtn.click();
    }
});

// Prevent password paste (security measure - optional)
/*
newPassword.addEventListener('paste', (e) => {
    e.preventDefault();
    showAlert('warning', 'Le copier-coller est désactivé pour des raisons de sécurité.');
});

confirmPassword.addEventListener('paste', (e) => {
    e.preventDefault();
    showAlert('warning', 'Le copier-coller est désactivé pour des raisons de sécurité.');
});
*/

// Password visibility indicator
let passwordVisibilityTimer;
newPassword.addEventListener('focus', () => {
    // Clear any existing timer
    clearTimeout(passwordVisibilityTimer);
    
    // Show hint after 3 seconds of inactivity
    passwordVisibilityTimer = setTimeout(() => {
        if (newPassword.value.length === 0) {
            showAlert('info', 'Astuce : Utilisez un gestionnaire de mots de passe pour générer un mot de passe fort.', 3000);
        }
    }, 3000);
});

newPassword.addEventListener('input', () => {
    clearTimeout(passwordVisibilityTimer);
});

// Prevent form submission on Enter in password fields (force button click)
const passwordInputs = [currentPassword, newPassword, confirmPassword];
passwordInputs.forEach(input => {
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                
                // Move to next field or submit
                const currentIndex = passwordInputs.indexOf(input);
                if (currentIndex < passwordInputs.length - 1) {
                    passwordInputs[currentIndex + 1].focus();
                } else if (!submitBtn.disabled) {
                    changePasswordForm.dispatchEvent(new Event('submit'));
                }
            }
        });
    }
});

// Clear invalid state on input
[currentPassword, newPassword, confirmPassword].forEach(input => {
    if (input) {
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                input.classList.remove('invalid');
            }
        });
    }
});

// Prevent accidental navigation
window.addEventListener('beforeunload', (e) => {
    const hasChanges = currentPassword.value.length > 0 || 
                      newPassword.value.length > 0 || 
                      confirmPassword.value.length > 0;
    
    const modal = document.getElementById('successModal');
    const modalVisible = modal && modal.style.display === 'flex';
    
    if (hasChanges && !modalVisible) {
        e.preventDefault();
        e.returnValue = 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?';
        return e.returnValue;
    }
});

// Password generator (optional feature)
function generateStrongPassword(length = 16) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = uppercase + lowercase + numbers + special;
    let password = '';
    
    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Add generate password button (optional)
/*
const generateBtn = document.createElement('button');
generateBtn.type = 'button';
generateBtn.className = 'btn-generate';
generateBtn.innerHTML = '<i class="bi bi-magic"></i> Générer un mot de passe';
generateBtn.onclick = () => {
    const password = generateStrongPassword();
    newPassword.value = password;
    confirmPassword.value = password;
    validateNewPassword();
    checkPasswordMatch();
    validateForm();
    showAlert('success', 'Mot de passe fort généré !');
};
// Append to form
*/

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels
    if (currentPassword) {
        currentPassword.setAttribute('aria-required', 'true');
        currentPassword.setAttribute('aria-describedby', 'current-password-help');
    }
    
    if (newPassword) {
        newPassword.setAttribute('aria-required', 'true');
        newPassword.setAttribute('aria-describedby', 'password-requirements');
    }
    
    if (confirmPassword) {
        confirmPassword.setAttribute('aria-required', 'true');
        confirmPassword.setAttribute('aria-describedby', 'password-match');
    }
    
    // Add live region for password strength
    if (strengthText) {
        strengthText.setAttribute('role', 'status');
        strengthText.setAttribute('aria-live', 'polite');
    }
    
    // Add live region for password match
    if (passwordMatch) {
        passwordMatch.setAttribute('role', 'status');
        passwordMatch.setAttribute('aria-live', 'polite');
    }
});

// Password strength tips
const strengthTips = {
    weak: 'Ajoutez plus de caractères variés pour renforcer votre mot de passe',
    medium: 'Presque bon ! Ajoutez encore quelques caractères spéciaux',
    strong: 'Excellent ! Votre mot de passe est très sécurisé'
};

function showStrengthTip(strength) {
    const tip = strengthTips[strength];
    if (tip) {
        // Could show as tooltip or alert
        console.log('💡 Conseil:', tip);
    }
}

// Track password change attempts (for security monitoring)
let changeAttempts = 0;
const MAX_ATTEMPTS = 5;

changePasswordForm.addEventListener('submit', () => {
    changeAttempts++;
    
    if (changeAttempts >= MAX_ATTEMPTS) {
        console.warn('⚠️ Multiple password change attempts detected');
        // Could implement rate limiting here
    }
});

console.log('✅ Change password page fully loaded');
console.log('🔒 Password requirements:');
console.log('  - Minimum 8 characters');
console.log('  - At least 1 uppercase letter');
console.log('  - At least 1 lowercase letter');
console.log('  - At least 1 number');
console.log('  - At least 1 special character');
console.log('🎯 Keyboard shortcuts:');
console.log('  - Ctrl/Cmd + Enter : Soumettre');
console.log('  - Escape : Annuler');