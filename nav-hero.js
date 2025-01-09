// Navigation & Hero Section Handler
class NavigationHandler {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navLinks = document.querySelector('.nav-links');
        this.darkModeToggle = document.getElementById('darkMode');
        this.lastScrollTop = 0;
        this.isNavVisible = true;

        this.initializeNavigation();
        this.initializeDarkMode();
        this.initializeHeroAnimations();
    }

    initializeNavigation() {
        // Smooth Navigation Bar
        window.addEventListener('scroll', () => {
            this.handleNavbarScroll();
            this.handleNavbarVisibility();
        });

        // Mobile Menu Toggle
        this.navToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu on link click
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-elements') && this.navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    handleNavbarScroll() {
        const scrollTop = window.pageYOffset;
        const navbar = this.navbar;

        if (scrollTop > 100) {
            navbar.classList.add('navbar-scrolled');
            // Add glass morphism effect
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.backgroundColor = 'rgba(var(--background-primary-rgb), 0.8)';
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.backdropFilter = 'none';
            navbar.style.backgroundColor = 'var(--background-primary)';
        }
    }

    handleNavbarVisibility() {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > this.lastScrollTop && scrollTop > 100) {
            // Scrolling down
            if (this.isNavVisible) {
                this.navbar.style.transform = 'translateY(-100%)';
                this.isNavVisible = false;
            }
        } else {
            // Scrolling up
            if (!this.isNavVisible) {
                this.navbar.style.transform = 'translateY(0)';
                this.isNavVisible = true;
            }
        }
        
        this.lastScrollTop = scrollTop;
    }

    toggleMobileMenu() {
        this.navLinks.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // Add animation
        if (this.navLinks.classList.contains('active')) {
            this.animateMobileMenuItems();
        }
    }

    closeMobileMenu() {
        this.navLinks.classList.remove('active');
        this.navToggle.classList.remove('active');
    }

    animateMobileMenuItems() {
        const menuItems = this.navLinks.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.animation = `slideIn 0.3s ease forwards ${index * 0.1}s`;
        });
    }

    initializeDarkMode() {
        // Check saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.darkModeToggle.checked = true;
        }

        // Theme toggle handler with animation
        this.darkModeToggle.addEventListener('change', () => {
            document.documentElement.style.transition = 'all 0.3s ease';
            
            if (this.darkModeToggle.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }

            // Remove transition after theme change
            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 300);
        });
    }

    initializeHeroAnimations() {
        const heroContent = document.querySelector('.hero-content');
        const heroTitle = heroContent.querySelector('h1');
        const heroSubtitle = heroContent.querySelector('.subtitle');
        const heroDescription = heroContent.querySelector('.description');
        const heroCTA = heroContent.querySelector('.cta-buttons');

        // Split text animation for title
        this.splitTextAnimation(heroTitle);

        // Fade in animations
        setTimeout(() => {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 500);

        setTimeout(() => {
            heroDescription.style.opacity = '1';
            heroDescription.style.transform = 'translateY(0)';
        }, 700);

        setTimeout(() => {
            heroCTA.style.opacity = '1';
            heroCTA.style.transform = 'translateY(0)';
        }, 900);

        // Parallax effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }

    splitTextAnimation(element) {
        const text = element.textContent;
        element.textContent = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${index * 0.05}s`;
            span.classList.add('char-animate');
            element.appendChild(span);
        });
    }
}

// Initialize Navigation Handler
const navigation = new NavigationHandler();

// Add necessary CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes charFadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .char-animate {
        display: inline-block;
        opacity: 0;
        animation: charFadeIn 0.5s ease forwards;
    }

    .hero-content .subtitle,
    .hero-content .description,
    .hero-content .cta-buttons {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }
`;
document.head.appendChild(style);