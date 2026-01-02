// Navigation functions

// Initialize navigation
function initNavigation() {
    // Update user UI
    updateUserUI();
    
    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function() {
            mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
            this.innerHTML = mobileMenu.style.display === 'block' ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar') && !event.target.closest('.mobile-menu')) {
                mobileMenu.style.display = 'none';
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Close mobile menu on link click
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.style.display = 'none';
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// Set active navigation link
function setActiveNavLink(page) {
    // Desktop nav
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.textContent.includes(page.charAt(0).toUpperCase() + page.slice(1))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Mobile nav
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        if (link.textContent.includes(page.charAt(0).toUpperCase() + page.slice(1))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle navigation with smooth transitions
function navigateTo(page, smooth = true) {
    if (smooth) {
        document.body.style.opacity = '0.7';
        setTimeout(() => {
            window.location.href = page;
        }, 200);
    } else {
        window.location.href = page;
    }
}