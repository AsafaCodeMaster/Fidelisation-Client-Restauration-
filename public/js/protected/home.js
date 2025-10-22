// Toggle Sidebar
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('toggleBtn');
        const logoToggle = document.getElementById('logoToggle');
        const mainContent = document.getElementById('mainContent');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        // Fonction pour toggle le sidebar
        function toggleSidebar() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }

        // Toggle avec le bouton hamburger
        toggleBtn.addEventListener('click', toggleSidebar);

        // Toggle avec le logo quand le sidebar est rétracté
        logoToggle.addEventListener('click', () => {
            if (sidebar.classList.contains('collapsed')) {
                toggleSidebar();
            }
        });

        // Mobile menu
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }

        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const themeLabel = document.querySelector('.theme-label');
        const body = document.body;

        // Charger le thème sauvegardé
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            body.classList.add('light-theme');
            themeToggle.classList.add('active');
            themeLabel.textContent = 'Light Mode';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            themeToggle.classList.toggle('active');
            
            const isLight = body.classList.contains('light-theme');
            themeLabel.textContent = isLight ? 'Light Mode' : 'Dark Mode';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });

        // Navigation Active State
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPath = window.location.pathname;
        
        navLinks.forEach(link => {
            // Marquer le lien actif en fonction de l'URL (sauf pour le logout)
            if (link.id !== 'logoutBtn') {
                const linkPath = link.getAttribute('href');
                if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
                    link.classList.add('active');
                }
            }
        });

        // Logout avec confirmation
        const logoutForm = document.getElementById('logoutForm');
        const logoutBtn = document.getElementById('logoutBtn');
        
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                logoutForm.submit();
            }
        });

        // Fermer le menu mobile en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('mobile-open');
                }
            }
        });

        // Animation au chargement
        window.addEventListener('load', () => {
            const cards = document.querySelectorAll('.card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'all 0.5s ease';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
        });