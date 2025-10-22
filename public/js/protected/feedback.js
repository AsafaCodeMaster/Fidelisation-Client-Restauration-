// Feedback Page JavaScript

// State management
const feedbackData = {
    overallRating: 0,
    produits: 0,
    accueil: 0,
    livraison: 0,
    prix: 0,
    fidelite: 0,
    libreExpression: '',
    emailConsent: false
};

// DOM Elements
const feedbackForm = document.getElementById('feedbackForm');
const feedbackCard = document.querySelector('.feedback-card');
const successMessage = document.getElementById('successMessage');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const libreExpression = document.getElementById('libreExpression');
const charCount = document.getElementById('charCount');
const emailConsent = document.getElementById('emailConsent');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupStarRatings();
    setupCharCounter();
    setupFormValidation();
    console.log('✅ Feedback page initialized');
});

// Setup star ratings
function setupStarRatings() {
    // Overall rating
    const overallStars = document.querySelectorAll('#overallRating .star-icon');
    setupStarGroup(overallStars, 'overallRating');
    
    // Category ratings
    const starGroups = document.querySelectorAll('.rating-item .star-group');
    starGroups.forEach(group => {
        const stars = group.querySelectorAll('.star-icon');
        const category = group.dataset.category;
        setupStarGroup(stars, category);
    });
}

// Setup individual star group
function setupStarGroup(stars, category) {
    stars.forEach((star, index) => {
        // Hover effect
        star.addEventListener('mouseenter', () => {
            highlightStars(stars, index + 1);
        });
        
        // Click to rate
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.value);
            setRating(stars, category, rating);
            
            // Add pulse animation
            star.classList.add('pulse');
            setTimeout(() => star.classList.remove('pulse'), 300);
        });
    });
    
    // Remove hover effect when mouse leaves
    const parent = stars[0].parentElement;
    parent.addEventListener('mouseleave', () => {
        const currentRating = category === 'overallRating' 
            ? feedbackData.overallRating 
            : feedbackData[category];
        highlightStars(stars, currentRating);
    });
}

// Highlight stars up to index
function highlightStars(stars, count) {
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.add('hover');
        } else {
            star.classList.remove('hover');
        }
    });
}

// Set rating for a category
function setRating(stars, category, rating) {
    // Update data
    if (category === 'overallRating') {
        feedbackData.overallRating = rating;
        document.getElementById('overallRatingValue').value = rating;
    } else {
        feedbackData[category] = rating;
        const input = document.querySelector(`input[name="${category}"]`);
        if (input) input.value = rating;
    }
    
    // Update UI
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
            star.classList.remove('hover');
        } else {
            star.classList.remove('active');
        }
    });
    
    // Validate form
    validateForm();
}

// Character counter
function setupCharCounter() {
    if (libreExpression && charCount) {
        libreExpression.addEventListener('input', (e) => {
            const count = e.target.value.length;
            charCount.textContent = count;
            
            // Change color when approaching limit
            if (count > 900) {
                charCount.style.color = '#ef4444';
            } else if (count > 800) {
                charCount.style.color = '#f59e0b';
            } else {
                charCount.style.color = 'var(--text-white)';
            }
            
            feedbackData.libreExpression = e.target.value;
        });
    }
}

// Form validation
function setupFormValidation() {
    if (emailConsent) {
        emailConsent.addEventListener('change', (e) => {
            feedbackData.emailConsent = e.target.checked;
        });
    }
    
    // Initial validation
    validateForm();
}

function validateForm() {
    if (!submitBtn) return;
    
    // Check if at least one rating is given (excluding overall)
    const hasRating = feedbackData.produits > 0 || 
                     feedbackData.accueil > 0 || 
                     feedbackData.livraison > 0 || 
                     feedbackData.prix > 0 || 
                     feedbackData.fidelite > 0;
    
    submitBtn.disabled = !hasRating;
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
if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!submitBtn) return;
        
        // Validate
        if (submitBtn.disabled) {
            showAlert('warning', 'Veuillez noter au moins un critère avant d\'envoyer.');
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        try {
            // Prepare data for submission
            const submissionData = {
                overallRating: feedbackData.overallRating,
                ratings: {
                    produits: feedbackData.produits,
                    accueil: feedbackData.accueil,
                    livraison: feedbackData.livraison,
                    prix: feedbackData.prix,
                    fidelite: feedbackData.fidelite
                },
                libreExpression: feedbackData.libreExpression.trim(),
                emailConsent: feedbackData.emailConsent,
                timestamp: new Date().toISOString()
            };
            
            // Submit to API
            const response = await fetch('/api/feedback/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Show success message
                showSuccessMessage();
                
                // Track event (optional)
                trackFeedbackSubmission(submissionData);
                
            } else {
                showAlert('danger', result.message || 'Erreur lors de l\'envoi du feedback.');
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

// Cancel button
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        if (hasUnsavedChanges()) {
            if (confirm('Êtes-vous sûr de vouloir annuler ? Toutes vos réponses seront perdues.')) {
                window.location.href = '/';
            }
        } else {
            window.location.href = '/';
        }
    });
}

// Check if there are unsaved changes
function hasUnsavedChanges() {
    return feedbackData.overallRating > 0 ||
           feedbackData.produits > 0 ||
           feedbackData.accueil > 0 ||
           feedbackData.livraison > 0 ||
           feedbackData.prix > 0 ||
           feedbackData.fidelite > 0 ||
           feedbackData.libreExpression.length > 0;
}

// Show success message
function showSuccessMessage() {
    if (!feedbackCard || !successMessage) return;
    
    feedbackCard.style.animation = 'fadeOut 0.5s ease';
    
    setTimeout(() => {
        feedbackCard.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.style.animation = 'fadeIn 0.5s ease';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
}

// Reset form
function resetForm() {
    if (!feedbackCard || !successMessage) return;
    
    // Reset data
    feedbackData.overallRating = 0;
    feedbackData.produits = 0;
    feedbackData.accueil = 0;
    feedbackData.livraison = 0;
    feedbackData.prix = 0;
    feedbackData.fidelite = 0;
    feedbackData.libreExpression = '';
    feedbackData.emailConsent = false;
    
    // Reset form
    if (feedbackForm) feedbackForm.reset();
    
    // Reset all stars
    document.querySelectorAll('.star-icon').forEach(star => {
        star.classList.remove('active', 'hover');
    });
    
    // Reset char counter
    if (charCount) charCount.textContent = '0';
    
    // Reset hidden inputs
    document.querySelectorAll('input[type="hidden"]').forEach(input => {
        input.value = '0';
    });
    
    // Show form, hide success
    successMessage.style.display = 'none';
    feedbackCard.style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Revalidate
    validateForm();
}

// Track feedback submission (analytics)
function trackFeedbackSubmission(data) {
    // Calculate average rating
    const ratings = Object.values(data.ratings).filter(r => r > 0);
    const avgRating = ratings.length > 0 
        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2)
        : 0;
    
    console.log('📊 Feedback submitted:', {
        averageRating: avgRating,
        totalCategories: ratings.length,
        hasComment: data.libreExpression.length > 0,
        emailConsent: data.emailConsent
    });
    
    // Optional: Send to analytics service
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'feedback_submit', {
    //         event_category: 'engagement',
    //         event_label: 'feedback_form',
    //         value: avgRating
    //     });
    // }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (submitBtn && !submitBtn.disabled) {
            feedbackForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to cancel
    if (e.key === 'Escape') {
        if (cancelBtn) cancelBtn.click();
    }
});

// Prevent accidental page close
window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges() && successMessage.style.display === 'none') {
        e.preventDefault();
        e.returnValue = 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?';
        return e.returnValue;
    }
});

// Auto-save draft (optional)
function saveDraft() {
    if (hasUnsavedChanges()) {
        const draft = {
            ...feedbackData,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem('feedback_draft', JSON.stringify(draft));
    }
}

function loadDraft() {
    const draft = localStorage.getItem('feedback_draft');
    if (draft) {
        try {
            const data = JSON.parse(draft);
            const savedAt = new Date(data.savedAt);
            const hoursSince = (new Date() - savedAt) / (1000 * 60 * 60);
            
            // Only load if less than 24 hours old
            if (hoursSince < 24) {
                if (confirm('Un brouillon de feedback a été trouvé. Voulez-vous le restaurer ?')) {
                    // Restore data
                    Object.assign(feedbackData, data);
                    
                    // Restore UI
                    if (libreExpression) libreExpression.value = data.libreExpression;
                    if (emailConsent) emailConsent.checked = data.emailConsent;
                    if (charCount) charCount.textContent = data.libreExpression.length;
                    
                    // Restore star ratings
                    restoreStarRatings();
                    
                    showAlert('info', 'Brouillon restauré');
                }
            } else {
                localStorage.removeItem('feedback_draft');
            }
        } catch (e) {
            console.error('Error loading draft:', e);
            localStorage.removeItem('feedback_draft');
        }
    }
}

function restoreStarRatings() {
    // Overall rating
    if (feedbackData.overallRating > 0) {
        const stars = document.querySelectorAll('#overallRating .star-icon');
        setRating(stars, 'overallRating', feedbackData.overallRating);
    }
    
    // Category ratings
    const categories = ['produits', 'accueil', 'livraison', 'prix', 'fidelite'];
    categories.forEach(category => {
        if (feedbackData[category] > 0) {
            const group = document.querySelector(`[data-category="${category}"]`);
            if (group) {
                const stars = group.querySelectorAll('.star-icon');
                setRating(stars, category, feedbackData[category]);
            }
        }
    });
}

// Auto-save every 30 seconds
setInterval(saveDraft, 30000);

// Load draft on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDraft();
    
    // Clear draft after successful submission
    const originalShowSuccess = showSuccessMessage;
    showSuccessMessage = function() {
        localStorage.removeItem('feedback_draft');
        originalShowSuccess();
    };
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }
    
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
    const starGroups = document.querySelectorAll('.star-group');
    starGroups.forEach((group, index) => {
        group.setAttribute('role', 'radiogroup');
        group.setAttribute('aria-label', 'Note de 1 à 5 étoiles');
        
        const stars = group.querySelectorAll('.star-icon');
        stars.forEach((star, starIndex) => {
            star.setAttribute('role', 'radio');
            star.setAttribute('tabindex', '0');
            star.setAttribute('aria-label', `${starIndex + 1} étoile${starIndex > 0 ? 's' : ''}`);
            
            // Keyboard navigation
            star.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    star.click();
                }
            });
        });
    });
    
    // Add ARIA live region for alerts
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.setAttribute('role', 'status');
        alertContainer.setAttribute('aria-live', 'polite');
        alertContainer.setAttribute('aria-atomic', 'true');
    }
});

// Rating statistics (optional)
function calculateRatingStats() {
    const ratings = [
        feedbackData.produits,
        feedbackData.accueil,
        feedbackData.livraison,
        feedbackData.prix,
        feedbackData.fidelite
    ].filter(r => r > 0);
    
    if (ratings.length === 0) return null;
    
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    const avg = sum / ratings.length;
    const min = Math.min(...ratings);
    const max = Math.max(...ratings);
    
    return {
        average: avg.toFixed(2),
        minimum: min,
        maximum: max,
        count: ratings.length
    };
}

// Show rating preview (optional feature)
function showRatingPreview() {
    const stats = calculateRatingStats();
    if (stats) {
        console.log('📊 Votre évaluation:', stats);
    }
}

// Add rating preview on star click
document.querySelectorAll('.star-icon').forEach(star => {
    star.addEventListener('click', () => {
        setTimeout(showRatingPreview, 100);
    });
});

console.log('✅ Feedback page fully loaded');
console.log('🎯 Keyboard shortcuts:');
console.log('  - Ctrl/Cmd + Enter : Envoyer le feedback');
console.log('  - Escape : Annuler');