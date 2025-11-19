        // Toggle theme
            const body = document.body;
            const themeIcon = document.getElementById('theme-icon');
        document.addEventListener('DOMContentLoaded' , () => {
            const theme = localStorage.getItem('theme');
            if(theme == 'dark'){
                dark();
            
            }else{
                light();
            
            }

        });
        function toggleTheme() {

            
            if (body.classList.contains('dark-theme')) {
                light();
            } else {
                dark();
            }
        }
        function dark() {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                themeIcon.textContent = '☀️';
                localStorage.clear();
                localStorage.setItem('theme' , 'dark');        }
        function light() {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                themeIcon.textContent = '🌙';
                localStorage.clear();
                localStorage.setItem('theme' , 'ligth');
        }