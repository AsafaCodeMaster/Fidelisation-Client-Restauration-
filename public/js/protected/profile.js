// Edit Mode Toggle
const editToggle = document.getElementById('editToggle');
const formInputs = document.querySelectorAll('.form-input, .form-select');
const formActions = document.getElementById('formActions');
const profileForm = document.getElementById('profileForm');
const cancelBtn = document.getElementById('cancelBtn');

let isEditMode = false;
let originalFormData = {};

// Save original form data
function saveOriginalData() {
    const formData = new FormData(profileForm);
    originalFormData = {};
    for (let [key, value] of formData.entries()) {
        originalFormData[key] = value;
    }
}

// Restore original data
function restoreOriginalData() {
    for (let key in originalFormData) {
        const input = profileForm.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = originalFormData[key];
        }
    }
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
        <div class="alert alert-${type}" id="${alertId}" style="animation: slideIn 0.3s ease;">
            <i class="bi bi-${icons[type]}"></i>
            <span>${message}</span>
            <button type="button" class="alert-close" onclick="closeAlert('${alertId}')">
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
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            alert.remove();
        }, 300);
    }
}

// Initialize
saveOriginalData();

// Edit toggle functionality
editToggle.addEventListener('click', () => {
    isEditMode = !isEditMode;
    editToggle.classList.toggle('active');
    
    formInputs.forEach(input => {
        input.disabled = !isEditMode;
    });
    
    formActions.style.display = isEditMode ? 'flex' : 'none';
    
    if (isEditMode) {
        saveOriginalData();
        showAlert('info', 'Mode édition activé. Modifiez vos informations puis cliquez sur "Sauvegarder".');
    } else {
        formActions.style.display = 'none';
    }
});

// Cancel button
cancelBtn.addEventListener('click', () => {
    if (confirm('Annuler les modifications ?')) {
        restoreOriginalData();
        isEditMode = false;
        editToggle.classList.remove('active');
        formInputs.forEach(input => {
            input.disabled = true;
        });
        formActions.style.display = 'none';
        showAlert('info', 'Modifications annulées.');
    }
});

// Form submission
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!isEditMode) return;
    
    const submitBtn = profileForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Validation
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!nom || !prenom || !email) {
        showAlert('danger', 'Veuillez remplir tous les champs obligatoires (*)');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('danger', 'Veuillez entrer une adresse email valide.');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Enregistrement...';
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(profileForm);
        const data = Object.fromEntries(formData.entries());
        
        const response = await fetch('/profile/update', {
            method: 'POST',
            credentials : 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (response.ok && result.success) {
            showAlert('success', 'Profil mis à jour avec succès !');

            // Update header display
            document.getElementById('displayName').textContent = `${prenom} ${nom}`;
            document.getElementById('displayEmail').textContent = email;
            document.getElementById('avatarInitials').textContent = 
                `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
            
            // Save new data and disable edit mode
            saveOriginalData();
            isEditMode = false;
            editToggle.classList.remove('active');
            formInputs.forEach(input => {
                input.disabled = true;
            });
            formActions.style.display = 'none';
            
        } else {
            showAlert('danger', result.message || 'Erreur lors de la mise à jour du profil.');
        }
        
    } catch (error) {
        // console.error('Error:', error);
        showAlert('danger', 'Erreur de connexion. Veuillez réessayer.');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Delete Account Modal
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const confirmDeleteInput = document.getElementById('confirmDeleteInput');

// Open delete modal
deleteAccountBtn.addEventListener('click', () => {
    deleteModal.style.display = 'flex';
    confirmDeleteInput.value = '';
    confirmDeleteBtn.disabled = true;
    document.body.style.overflow = 'hidden';
});

// Close delete modal
function closeDeleteModal() {
    deleteModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

cancelDeleteBtn.addEventListener('click', closeDeleteModal);

// Close modal when clicking backdrop
deleteModal.querySelector('.modal-backdrop').addEventListener('click', closeDeleteModal);

// Enable confirm button when typing SUPPRIMER
confirmDeleteInput.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    confirmDeleteBtn.disabled = value !== 'SUPPRIMER';
});

// Confirm delete account
confirmDeleteBtn.addEventListener('click', async () => {
    // alert('yes , it is clicked');
    const confirmText = confirmDeleteInput.value.trim();
    
    if (confirmText !== 'SUPPRIMER') {
        showAlert('danger', 'Veuillez taper "SUPPRIMER" pour confirmer.');
        return;
    }
    
    if (!confirm('DERNIÈRE CONFIRMATION : Êtes-vous absolument sûr de vouloir supprimer votre compte ?')) {
        return;
    }
    
    const originalText = confirmDeleteBtn.innerHTML;
    confirmDeleteBtn.classList.add('loading');
    confirmDeleteBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Suppression...';
    confirmDeleteBtn.disabled = true;
    
    try {
        const response = await fetch('/profile/delete', {
            method: 'DELETE',
            credentials : 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showAlert('success', 'Compte supprimé. Redirection...');
            
            setTimeout(async () => {
                await fetch('/logout', {
            method: 'POST',
            credentials : 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });
            }, 2000);
            
        } else {
            showAlert('danger', result.message || 'Erreur lors de la suppression du compte.');
            confirmDeleteBtn.classList.remove('loading');
            confirmDeleteBtn.innerHTML = originalText;
            confirmDeleteBtn.disabled = true;
        }
        
    } catch (error) {
        // console.error('Error:', error);
        showAlert('danger', 'Erreur de connexion. Veuillez réessayer.');
        confirmDeleteBtn.classList.remove('loading');
        confirmDeleteBtn.innerHTML = originalText;
        confirmDeleteBtn.disabled = true;
    }
});

// Avatar upload functionality (placeholder)
const avatarUploadBtn = document.querySelector('.avatar-upload-btn');
avatarUploadBtn.addEventListener('click', () => {
    showAlert('info', 'Fonctionnalité de changement d\'avatar à venir !');
    // TODO: Implémenter l'upload d'avatar
});
// Phone number validation rules:
// +###########  (max 13 chars, + only at start)
// OR
// ##########   (max 10 digits)
//new phone input conditions
const phoneInput = document.getElementById('numero');

if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value;

        // If starts with +
        if (value.startsWith('+')) {
            // Remove everything after + that is not a digit
            value = '+' + value.substring(1).replace(/\D/g, '');

            // Enforce max length 13
            if (value.length > 13) {
                value = value.substring(0, 13);
            }
        } 
        
        else {
            // Remove all non-digits
            value = value.replace(/\D/g, '');

            // Enforce max length 10
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
        }

        // Set the cleaned value
        e.target.value = value;
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + E to toggle edit mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        editToggle.click();
    }
    
    // Ctrl/Cmd + S to save (when in edit mode)
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && isEditMode) {
        e.preventDefault();
        profileForm.dispatchEvent(new Event('submit'));
    }
    
    // Escape to cancel edit mode or close modal
    if (e.key === 'Escape') {
        if (deleteModal.style.display === 'flex') {
            closeDeleteModal();
        } else if (isEditMode) {
            cancelBtn.click();
        }
    }
});

// Prevent leaving page with unsaved changes
window.addEventListener('beforeunload', (e) => {
    if (isEditMode) {
        // Check if there are actual changes
        let hasChanges = false;
        const currentData = new FormData(profileForm);
        
        for (let [key, value] of currentData.entries()) {
            if (originalFormData[key] !== value) {
                hasChanges = true;
                break;
            }
        }
        
        if (hasChanges) {
            e.preventDefault();
            e.returnValue = 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?';
            return e.returnValue;
        }
    }
});

// Auto-save draft to localStorage (optional feature)
function saveDraftToLocalStorage() {
    if (isEditMode) {
        const formData = new FormData(profileForm);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem('profile_draft', JSON.stringify(data));
    }
}

function loadDraftFromLocalStorage() {
    const draft = localStorage.getItem('profile_draft');
    if (draft) {
        try {
            const data = JSON.parse(draft);
            let hasDraft = false;
            
            for (let key in data) {
                const input = profileForm.querySelector(`[name="${key}"]`);
                if (input && data[key] !== originalFormData[key] && data[key]) {
                    hasDraft = true;
                    break;
                }
            }
            
            if (hasDraft) {
                if (confirm('Un brouillon de modifications a été trouvé. Voulez-vous le restaurer ?')) {
                    for (let key in data) {
                        const input = profileForm.querySelector(`[name="${key}"]`);
                        if (input && data[key]) {
                            input.value = data[key];
                        }
                    }
                    // Activate edit mode
                    editToggle.click();
                }else{
                    // alert('yes continue');
                    localStorage.removeItem('profile_draft');
                }
            }
        } catch (e) {
            // console.error('Error loading draft:', e);
        }
    }
}

// Auto-save draft every 30 seconds when in edit mode
setInterval(() => {
    if (isEditMode) {
        saveDraftToLocalStorage();
    }
}, 30000);

// Load draft on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDraftFromLocalStorage();
    
    // Clear draft after successful save
    profileForm.addEventListener('submit', () => {
        localStorage.removeItem('profile_draft');
    });
});

// Animation styles for alerts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }
    
    .alert {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        margin-bottom: 1rem;
    }
    
    .alert-close {
        margin-left: auto;
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 1.25rem;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
    }
    
    .alert-close:hover {
        transform: scale(1.2);
    }
`;
document.head.appendChild(style);

// Real-time form validation feedback
const emailInput = document.getElementById('email');
const nomInput = document.getElementById('nom');
const prenomInput = document.getElementById('prenom');

function validateField(input, validationFn, errorMessage) {
    input.addEventListener('blur', () => {
        if (input.value && !input.disabled) {
            if (!validationFn(input.value)) {
                input.style.borderColor = 'var(--danger-red)';
                
                // Show inline error if not exists
                let errorSpan = input.parentElement.querySelector('.field-error');
                if (!errorSpan) {
                    errorSpan = document.createElement('span');
                    errorSpan.className = 'field-error';
                    errorSpan.style.cssText = 'color: var(--danger-red); font-size: 0.75rem; margin-top: 0.25rem; display: block;';
                    input.parentElement.appendChild(errorSpan);
                }
                errorSpan.textContent = errorMessage;
            } else {
                input.style.borderColor = 'var(--success-green)';
                const errorSpan = input.parentElement.querySelector('.field-error');
                if (errorSpan) errorSpan.remove();
            }
        }
    });
    
    input.addEventListener('focus', () => {
        input.style.borderColor = '';
        const errorSpan = input.parentElement.querySelector('.field-error');
        if (errorSpan) errorSpan.remove();
    });
}

// Email validation
if (emailInput) {
    validateField(
        emailInput,
        (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        'Adresse email invalide'
    );
}

// Name validation (no numbers)
if (nomInput) {
    validateField(
        nomInput,
        (value) => /^[a-zA-ZÀ-ÿ\s-]+$/.test(value),
        'Le nom ne peut contenir que des lettres'
    );
}

if (prenomInput) {
    validateField(
        prenomInput,
        (value) => /^[a-zA-ZÀ-ÿ\s-]+$/.test(value),
        'Le prénom ne peut contenir que des lettres'
    );
}

// console.log('✅ Profile page initialized');
// console.log('Raccourcis clavier :');
// console.log('  - Ctrl/Cmd + E : Activer/désactiver le mode édition');
// console.log('  - Ctrl/Cmd + S : Sauvegarder (en mode édition)');
// console.log('  - Escape : Annuler les modifications ou fermer le modal');