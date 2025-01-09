// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Disable right click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkMode');
    const darkModeLabel = darkModeToggle.nextElementSibling;
    
    // Set initial state
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeToggle.checked = true;
        darkModeLabel.setAttribute('aria-checked', 'true');
    }

    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            darkModeLabel.setAttribute('aria-checked', 'true');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            darkModeLabel.setAttribute('aria-checked', 'false');
        }
        
        // Reset and re-trigger skill progress animations
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            bar.classList.remove('animate');
            // Force reflow
            void bar.offsetWidth;
            bar.classList.add('animate');
        });
        
        // Reset progress bars
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            const progressBar = card.querySelector('.skill-progress');
            progressBar.style.width = '0';
            setTimeout(() => {
                const progress = card.getAttribute('data-progress');
                progressBar.style.width = progress + '%';
            }, 100);
        });
    });

    // Navigation background on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'var(--background-primary)';
            navbar.style.boxShadow = '0 2px 10px var(--shadow-color)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('open');
        });

        // Close menu when a link is clicked
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                navToggle.classList.remove('open');
            });
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-elements') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking a link
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });

    // Skills progress animation
    const skillSection = document.querySelector('#skills');
    const skillCards = document.querySelectorAll('.skill-card');

    const animateSkills = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillCards.forEach(card => {
                    const progress = card.getAttribute('data-progress');
                    const progressBar = card.querySelector('.skill-progress');
                    progressBar.style.width = progress + '%';
                });
            }
        });
    };

    const skillsObserver = new IntersectionObserver(animateSkills, {
        threshold: 0.3
    });

    if (skillSection) {
        skillsObserver.observe(skillSection);
    }

    // Typing Effect
    const typedTextElement = document.querySelector('.typed-text');
    const phrases = [
        'Computer Engineer',
        'Software Developer', 
        'Tech Innovator',
        'Problem Solver'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing effect
    type();

    // EmailJS Integration
    emailjs.init("MB9oQKoQHyNfLG1Wl");

    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if EmailJS is available
            if (typeof emailjs === 'undefined') {
                showNotification('Email service is currently unavailable. Please try again later.', 'error');
                return;
            }

            // Disable submit button and show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Collect form data
            const formData = {
                name: document.querySelector('input[name="name"]').value,
                email: document.querySelector('input[name="email"]').value,
                subject: document.querySelector('input[name="subject"]').value,
                message: document.querySelector('textarea[name="message"]').value
            };

            // Send email using EmailJS
            emailjs.send("service_yflypk7", "template_tfwao1x", formData)
                .then(function(response) {
                    // Success
                    showNotification('Message sent successfully! I will get back to you soon.', 'success');
                    contactForm.reset();
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }, function(error) {
                    // Error
                    console.error('EmailJS Error:', error);
                    showNotification('Failed to send message. Please try again later.', 'error');
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                });
        });
    }
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }
    // Add scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add CSS for scroll to top button and notifications
    const style = document.createElement('style');
    style.textContent = `
        .scroll-top-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        }

        .scroll-top-btn.show {
            opacity: 1;
            visibility: visible;
        }

        .scroll-top-btn:hover {
            background: var(--secondary-color);
            transform: translateY(-3px);
        }

        .notification {
            position: fixed;
            bottom: 20px;
            left: 20px;
            padding: 15px 25px;
            background: var(--primary-color);
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 6px var(--shadow-color);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }

        .notification.success {
            background: #10B981;
        }

        .notification.error {
            background: #EF4444;
        }

        .cursor-dot,
        .cursor-dot-outline {
            pointer-events: none;
            position: fixed;
            top: 50%;
            left: 50%;
            border-radius: 50%;
            opacity: 0;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease-in-out;
            z-index: 9999;
        }

        .cursor-dot {
            width: 8px;
            height: 8px;
            background-color: var(--primary-color);
        }

        .cursor-dot-outline {
            width: 40px;
            height: 40px;
            background-color: rgba(var(--primary-color-rgb), 0.1);
            border: 2px solid var(--primary-color);
        }
    `;
    document.head.appendChild(style);

    // Mouse cursor effect
const cursor = {
    dot: document.createElement('div'),
    dotOutline: document.createElement('div'),
    init: function() {
        // Only initialize if it's not a touch device
        if (isTouchDevice()) {
            return; // Exit if it's a touch device
        }

        this.dot.classList.add('cursor-dot');
        this.dotOutline.classList.add('cursor-dot-outline');
        document.body.appendChild(this.dot);
        document.body.appendChild(this.dotOutline);

        this.cursorVisible = true;
        this.cursorEnlarged = false;

        this.endX = window.innerWidth / 2;
        this.endY = window.innerHeight / 2;
        this.dotX = this.endX;
        this.dotY = this.endY;
        this.dotOutlineX = this.endX;
        this.dotOutlineY = this.endY;

        this.setupEventListeners();
        this.animateDotOutline();
        
        // Show cursor when initialization is complete
        setTimeout(() => {
            this.dot.style.opacity = 1;
            this.dotOutline.style.opacity = 1;
        }, 500);
    },
    // ... rest of the cursor object methods remain the same
};

    // Initialize cursor effect
    cursor.init();

    // Auto Scroll Button
    const autoScrollBtn = document.getElementById('autoScrollBtn');
    let isScrolling = false;
    let scrollInterval;
    let scrollSpeed = 2; // pixels per interval

    function startAutoScroll() {
        if (!isScrolling) {
            isScrolling = true;
            autoScrollBtn.classList.add('scrolling');
            scrollInterval = setInterval(() => {
                window.scrollBy({
                    top: scrollSpeed,
                    behavior: 'auto'
                });

                // Check if we've reached the bottom
                if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
                    stopAutoScroll();
                }
            }, 10);
        }
    }

    function stopAutoScroll() {
        if (isScrolling) {
            isScrolling = false;
            autoScrollBtn.classList.remove('scrolling');
            clearInterval(scrollInterval);
        }
    }
    
    // Touch events for mobile
    autoScrollBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startAutoScroll();
    });

    autoScrollBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopAutoScroll();
    });

    // Mouse events for desktop
    autoScrollBtn.addEventListener('mousedown', startAutoScroll);
    autoScrollBtn.addEventListener('mouseup', stopAutoScroll);
    autoScrollBtn.addEventListener('mouseleave', stopAutoScroll);

    // Stop scrolling when user manually scrolls
    document.addEventListener('wheel', stopAutoScroll);
    document.addEventListener('touchmove', stopAutoScroll);

    // Adjust scroll speed based on page height
    function updateScrollSpeed() {
        const pageHeight = document.documentElement.scrollHeight;
        scrollSpeed = Math.max(1, Math.min(5, pageHeight / 5000));
    }

    window.addEventListener('resize', updateScrollSpeed);
    updateScrollSpeed(); // Initial speed calculation

    // Notification System
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});
