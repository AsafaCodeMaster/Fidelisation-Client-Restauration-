// Toggle Sidebar
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('toggleBtn');
        const logoToggle = document.getElementById('logoToggle');
        const mainContent = document.getElementById('mainContent');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const avatarInitials =document.getElementById('avatarInitials');
        const displayName = document.getElementById('displayName');
        const totalPurchase = document.getElementById('totalPurchase');
        const displayEmail = document.getElementById('displayEmail');
        const clientPoints = document.getElementById('clientPoints');
        const clientRank = document.getElementById('clientRank');
        const nom = document.getElementById('nom');
        const prenom = document.getElementById('prenom');
        const email = document.getElementById('email');
        const numero = document.getElementById('numero');
        const adresse = document.getElementById('adresse');
        const ville = document.getElementById('ville');
        const genre = document.getElementById('genre');
        const dateNaissance = document.getElementById('dateNaissance');
        const lastTimePasswordChanged = document.getElementById('lastTimePasswordChanged');
        let data;

        
        document.addEventListener('DOMContentLoaded' , async () => {
            await load();
            renderData();
        });
        // Fonction pour toggle le sidebar
        async function load(){
            await loadData();
            await loadTotalPurchase();

        }
        async function loadData(){
            const fetcher = await fetch('/user/load' , {credentials: 'include'});
            const result = await fetcher.json();
            if(result.success){
             data = result.data;

        
        }else{
            alert('not loaded but fetch working');
        }
        

        }
        async function loadTotalPurchase(){
            const fetcher = await fetch('/user/purchase' , {credentials: 'include'});
            const result = await fetcher.json();
        /*     alert(result.totalpurchase); */
            if(result.success){
             totalPurchase.innerText = result.totalpurchase;

        
        }else{
            alert('not loaded but fetch purchase working');
        }
        }
        function renderData() {
            const name = data.firstName + " " + data.lastName;
            avatarInitials.innerText = data.firstName[0] + data.lastName[0];
            displayName.innerHTML = name;
            displayEmail.innerHTML= data.email;
            clientPoints.innerHTML = data.rewardPoints;
            clientRank.innerHTML = data.rewardPoints <= 50 ? 'bronze' : (data.rewardPoints <= 100 ? 'argent' : 'or');
            nom.setAttribute('placeholder' , data.firstName);
            nom.value=data.firstName;
            prenom.setAttribute('placeholder' , data.lastName);
            prenom.value=data.lastName;
            email.setAttribute('placeholder' , data.email);
            email.value=data.email;
            numero.setAttribute('placeholder' , data.phoneNumber === undefined || data.phoneNumber === null ? '+261...' : data.phoneNumber.trim());
            numero.value=data.phoneNumber === undefined || data.phoneNumber === null  ? '+261' : data.phoneNumber.trim();
            adresse.setAttribute('placeholder' , data.adress === undefined || data.adress === null ? 'Pas encore d\' addresse ' : data.adress.trim());
            adresse.value=  data.adress === undefined || data.adress === null ? '' : data.adress.trim();
            ville.setAttribute('placeholder' , data.city === null || data.city === undefined ? 'Entrez la ville ou vous vous situez' : data.city);
            ville.value=data.city === undefined || data.city === null ? '' : data.city;
            lastTimePasswordChanged.innerText=data.lastPasswordChanged;

            dateNaissance.value = data.birthdate.trim();
            genre.value = data.gender=='male' ?'homme' : (data.gender == 'female' ? 'femme' : 'autre');
            console.table(data);
        }

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
        
        navLinks.forEach(link => link.classList.remove('active'));
        
        navLinks.forEach(link => {
            // Marquer le lien actif en fonction de l'URL (sauf pour le logout)
  
                  const linkPath = link.getAttribute('href');
            if (linkPath !== null) {


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