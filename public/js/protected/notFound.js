// 404 Page JavaScript - Adaptive

// Apply saved theme from localStorage
document.addEventListener('DOMContentLoaded', () => {
    // Load theme
    loadTheme();
    
    // Setup search
    setupSearch();
    
    // console.log('✅ 404 page initialized');
});

// Load theme from localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    // Predefined pages for search suggestions
    const pages = [
        { name: 'Accueil', url: '/', keywords: ['home', 'accueil', 'dashboard'] },
        { name: 'Points', url: '/points', keywords: ['points', 'gems', 'fidélité'] },
        { name: 'Commander', url: '/orders', keywords: ['commander', 'order', 'acheter', 'produits'] },
        { name: 'Récompenses', url: '/rewards-history', keywords: ['récompenses', 'rewards', 'cadeaux'] },
        { name: 'Profil', url: '/profile', keywords: ['profil', 'profile', 'compte', 'paramètres'] },
        { name: 'Historique', url: '/purchase-history', keywords: ['historique', 'transactions', 'history'] },
        { name: 'Feedback', url: '/feedback', keywords: ['feedback', 'avis', 'commentaire'] },
        { name: 'Mot de passe', url: '/change-password', keywords: ['password', 'mot de passe', 'sécurité' , 'change'] }
    ];

    let suggestionsDiv = null;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        // Remove existing suggestions
        if (suggestionsDiv) {
            suggestionsDiv.remove();
            suggestionsDiv = null;
        }

        if (query.length < 2) return;

        // Filter pages
        const matches = pages.filter(page => 
            page.name.toLowerCase().includes(query) ||
            page.keywords.some(keyword => keyword.includes(query))
        ).slice(0, 5);

        if (matches.length === 0) return;

        // Create suggestions dropdown
        suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'search-suggestions';
        suggestionsDiv.innerHTML = matches.map(page => `
            <a href="${page.url}" class="suggestion-item">
                <i class="bi bi-arrow-right"></i>
                ${page.name}
            </a>
        `).join('');

        // Add styles
        suggestionsDiv.style.cssText = `
            position: absolute;
            top: calc(100% + 0.5rem);
            left: 0;
            right: 0;
            background: var(--dark-bg);
            border: 1px solid rgba(220, 38, 38, 0.2);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 100;
        `;

        // Style suggestion items
        const suggestionItems = suggestionsDiv.querySelectorAll('.suggestion-item');
        suggestionItems.forEach(item => {
            item.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem 1.5rem;
                color: var(--text-white);
                text-decoration: none;
                border-bottom: 1px solid rgba(220, 38, 38, 0.1);
                transition: all 0.3s;
            `;

            item.addEventListener('mouseenter', () => {
                item.style.background = 'rgba(220, 38, 38, 0.2)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
            });
        });

        // Remove border from last item
        if (suggestionItems.length > 0) {
            suggestionItems[suggestionItems.length - 1].style.borderBottom = 'none';
        }

        searchInput.parentElement.style.position = 'relative';
        searchInput.parentElement.appendChild(suggestionsDiv);
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && suggestionsDiv && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.remove();
            suggestionsDiv = null;
        }
    });

    // Navigate with Enter key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && suggestionsDiv) {
            const firstSuggestion = suggestionsDiv.querySelector('.suggestion-item');
            if (firstSuggestion) {
                window.location.href = firstSuggestion.getAttribute('href');
            }
        }

        // Close with Escape
        if (e.key === 'Escape' && suggestionsDiv) {
            suggestionsDiv.remove();
            suggestionsDiv = null;
            searchInput.blur();
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus search with Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Go back with Escape
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && document.activeElement !== searchInput) {
            history.back();
        }
    }
});

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    const errorNumber = document.querySelector('.error-number');
    if (!errorNumber) return;

    errorNumber.style.animation = 'none';
    setTimeout(() => {
        errorNumber.style.animation = 'rainbow 2s linear infinite';
    }, 10);

    // Add rainbow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { color: #ff0000; }
            16% { color: #ff8800; }
            33% { color: #ffff00; }
            50% { color: #00ff00; }
            66% { color: #0088ff; }
            83% { color: #8800ff; }
            100% { color: #ff0000; }
        }
    `;
    document.head.appendChild(style);

    // console.log('🎉 Easter egg activated!');
}

// Auto-redirect after inactivity (optional)
/*
let inactivityTimer;
const AUTO_REDIRECT_DELAY = 30000; // 30 seconds

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        console.log('Auto-redirecting due to inactivity...');
        window.location.href = '/';
    }, AUTO_REDIRECT_DELAY);
}

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keydown', resetInactivityTimer);
resetInactivityTimer();
*/

// console.log('🎯 Keyboard shortcuts:');
// console.log('  - Ctrl/Cmd + K : Focus search');
// console.log('  - Escape : Go back');
// console.log('  - Enter in search : Navigate to first result');