        // Toggle theme
        function toggleTheme() {
            const body = document.body;
            const themeIcon = document.getElementById('theme-icon');
            
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                themeIcon.textContent = '🌙';
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                themeIcon.textContent = '☀️';
            }
        }