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
    let menuOpen = false;

    function toggleMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        menuOpen = !menuOpen;
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    }

    // Add both click and touch events
    navToggle.addEventListener('click', toggleMenu);
    navToggle.addEventListener('touchend', toggleMenu, { passive: false });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (menuOpen) {
                toggleMenu();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menuOpen && !navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            toggleMenu();
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
        
        .cursor-clicking {
            cursor: none;
        }
        
        .cursor-clicking .cursor-dot {
            transform: scale(0.5);
            background-color: var(--secondary-color);
        }
        
        .cursor-clicking .cursor-dot-outline {
            transform: scale(0.5);
            background-color: rgba(var(--secondary-color-rgb), 0.1);
            border-color: var(--secondary-color);
        }
        
        .cursor-hover {
            cursor: none;
        }
        
        .cursor-hover .cursor-dot {
            transform: scale(1.2);
            background-color: var(--secondary-color);
        }
        
        .cursor-hover .cursor-dot-outline {
            transform: scale(1.2);
            background-color: rgba(var(--secondary-color-rgb), 0.1);
            border-color: var(--secondary-color);
        }
    `;
    document.head.appendChild(style);

    // Custom Cursor
    const cursor = {
        dot: document.createElement('div'),
        dotOutline: document.createElement('div'),
        cursorVisible: true,
        cursorEnlarged: false,
        
        init: function() {
            // Check if it's a touch device
            if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
                return; // Don't initialize cursor on touch devices
            }

            // Create cursor elements
            this.dot.classList.add('cursor-dot');
            this.dotOutline.classList.add('cursor-dot-outline');
            document.body.appendChild(this.dot);
            document.body.appendChild(this.dotOutline);

            // Set initial position
            const initEvent = new MouseEvent('mousemove', {
                clientX: window.innerWidth / 2,
                clientY: window.innerHeight / 2
            });
            this.cursorMove(initEvent);

            // Event Listeners
            document.addEventListener('mousemove', e => this.cursorMove(e));
            document.addEventListener('mouseenter', e => this.cursorEnter(e));
            document.addEventListener('mouseleave', e => this.cursorLeave(e));
            document.addEventListener('mousedown', e => this.cursorDown(e));
            document.addEventListener('mouseup', e => this.cursorUp(e));

            // Add hover listeners
            const clickables = document.querySelectorAll(
                'a, button, input, textarea, select, .nav-toggle, .theme-toggle'
            );
            
            clickables.forEach(el => {
                el.addEventListener('mouseover', () => this.cursorEnlarge());
                el.addEventListener('mouseout', () => this.cursorShrink());
            });

            // Start the animation loop
            requestAnimationFrame(() => this.render());
        },

        cursorMove: function(e) {
            this.endX = e.clientX;
            this.endY = e.clientY;
            this.dot.style.top = this.endY + 'px';
            this.dot.style.left = this.endX + 'px';
        },

        cursorEnter: function(e) {
            this.cursorVisible = true;
            this.toggleCursorVisibility();
        },

        cursorLeave: function(e) {
            this.cursorVisible = false;
            this.toggleCursorVisibility();
        },

        cursorDown: function(e) {
            this.cursorEnlarged = true;
            this.toggleCursorSize();
        },

        cursorUp: function(e) {
            this.cursorEnlarged = false;
            this.toggleCursorSize();
        },

        cursorEnlarge: function() {
            this.cursorEnlarged = true;
            this.toggleCursorSize();
        },

        cursorShrink: function() {
            this.cursorEnlarged = false;
            this.toggleCursorSize();
        },

        toggleCursorVisibility: function() {
            if (this.cursorVisible) {
                this.dot.style.opacity = 1;
                this.dotOutline.style.opacity = 1;
            } else {
                this.dot.style.opacity = 0;
                this.dotOutline.style.opacity = 0;
            }
        },

        toggleCursorSize: function() {
            if (this.cursorEnlarged) {
                this.dot.classList.add('cursor-click');
                this.dotOutline.classList.add('cursor-click');
            } else {
                this.dot.classList.remove('cursor-click');
                this.dotOutline.classList.remove('cursor-click');
            }
        },

        render: function() {
            const targetX = this.endX;
            const targetY = this.endY;
            const currentX = parseFloat(this.dotOutline.style.left) || targetX;
            const currentY = parseFloat(this.dotOutline.style.top) || targetY;
            
            const deltaX = targetX - currentX;
            const deltaY = targetY - currentY;
            
            this.dotOutline.style.left = currentX + (deltaX * 0.2) + 'px';
            this.dotOutline.style.top = currentY + (deltaY * 0.2) + 'px';
            
            requestAnimationFrame(() => this.render());
        }
    };

    // Initialize cursor
    cursor.init();

    // Initialize scroll animations
    window.addEventListener('scroll', () => {
        // Add any scroll animations here if needed
    });

    // Show notification system
    showNotification('Welcome to my portfolio!', 'success');

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
