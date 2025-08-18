// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Global variables for slideshow
let currentSlideIndex = 0;
let slideInterval;
let isPaused = false;
const slideImages = [
    'images/background.png',
    'images/thumb1.png',
    'images/thumb2.png',
    'images/thumb3.png',
    'images/thumb4.png',
    'images/thumb5.png',
    'images/thumb6.png'
];

// Initialize all website functionality
function initializeWebsite() {
    setupSmoothScrolling();
    setupMobileMenu();
    setupScrollEffects();
    setupServiceCardAnimations();
    setupThumbnailGallery();
    setupAutoSlideshow();
    setupPricingAnimation();
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.remove('active');
            }
        });
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });

        // Close mobile menu when clicking on nav links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
}

// Header scroll effects
function setupScrollEffects() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', throttle(function() {
        const header = document.querySelector('header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollTop = scrollTop;
    }, 100));
}

// Service card animations on scroll
function setupServiceCardAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards for animation
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe contact items for animation
    document.querySelectorAll('.contact-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

// Thumbnail gallery functionality
function setupThumbnailGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-image');
    
    // Set first thumbnail as active by default
    if (thumbnails.length > 0) {
        thumbnails[0].classList.add('active');
    }
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            // Pause auto slideshow when user clicks
            pauseSlideshow();
            
            // Update current slide index
            currentSlideIndex = index;
            
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            const imgElement = this.querySelector('img');
            if (imgElement && mainImage && imgElement.src) {
                updateMainImage(imgElement.src);
            }
        });
    });
}

// Auto slideshow functionality
function setupAutoSlideshow() {
    const mainImage = document.getElementById('main-image');
    const slideshowControls = document.querySelector('.slideshow-controls');
    
    if (!mainImage) return;
    
    // Create slideshow controls if they don't exist
    if (!slideshowControls) {
        createSlideshowControls();
    }
    
    // Start auto slideshow
    startSlideshow();
    
    // Pause slideshow on hover
    const foldedSection = document.querySelector('.folded-section');
    if (foldedSection) {
        foldedSection.addEventListener('mouseenter', pauseSlideshow);
        foldedSection.addEventListener('mouseleave', resumeSlideshow);
    }
}

// Create slideshow control buttons
function createSlideshowControls() {
    const foldedSection = document.querySelector('.folded-section .container');
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'slideshow-controls';
    
    const pauseBtn = document.createElement('button');
    pauseBtn.className = 'slideshow-pause';
    pauseBtn.textContent = 'Pause';
    pauseBtn.addEventListener('click', toggleSlideshow);
    
    controlsDiv.appendChild(pauseBtn);
    
    // Insert after image thumbnails
    const thumbnails = document.querySelector('.image-thumbnails');
    if (thumbnails && foldedSection) {
        thumbnails.parentNode.insertBefore(controlsDiv, thumbnails.nextSibling);
    }
}

// Start the auto slideshow
function startSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    
    slideInterval = setInterval(() => {
        if (!isPaused) {
            nextSlide();
        }
    }, 2000); // Change image every 2 seconds
}

// Next slide function
function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % slideImages.length;
    
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage) {
        updateMainImage(slideImages[currentSlideIndex]);
    }
    
    // Update active thumbnail
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentSlideIndex);
    });
}

// Update main image with smooth transition
function updateMainImage(imageSrc) {
    const mainImage = document.getElementById('main-image');
    
    if (mainImage && imageSrc) {
        // Fade out
        mainImage.style.opacity = '0.7';
        
        setTimeout(() => {
            mainImage.src = imageSrc;
            // Fade in
            mainImage.style.opacity = '1';
        }, 200);
    }
}

// Pause slideshow
function pauseSlideshow() {
    isPaused = true;
    const pauseBtn = document.querySelector('.slideshow-pause');
    if (pauseBtn) {
        pauseBtn.textContent = 'Resume';
    }
}

// Resume slideshow
function resumeSlideshow() {
    isPaused = false;
    const pauseBtn = document.querySelector('.slideshow-pause');
    if (pauseBtn) {
        pauseBtn.textContent = 'Pause';
    }
}

// Toggle slideshow play/pause
function toggleSlideshow() {
    if (isPaused) {
        resumeSlideshow();
    } else {
        pauseSlideshow();
    }
}

// Change main image function (called from HTML onclick)
function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && imageSrc) {
        // Pause auto slideshow when user manually changes image
        pauseSlideshow();
        
        // Find the index of the selected image
        const imageIndex = slideImages.findIndex(img => img.includes(imageSrc.split('/').pop()));
        if (imageIndex !== -1) {
            currentSlideIndex = imageIndex;
        }
        
        // Update main image with fade effect
        updateMainImage(imageSrc);
        
        // Update active thumbnail
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        // Find and activate the clicked thumbnail
        thumbnails.forEach(thumb => {
            const img = thumb.querySelector('img');
            if (img && img.src.includes(imageSrc.split('/').pop())) {
                thumb.classList.add('active');
            }
        });
    }
}

// Add smooth reveal animation for pricing table
function setupPricingAnimation() {
    const pricingTable = document.querySelector('.pricing-table');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    if (pricingTable) {
        pricingTable.style.opacity = '0';
        pricingTable.style.transform = 'translateY(30px)';
        pricingTable.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(pricingTable);
    }
}

// Contact form functionality (if needed later)
function setupContactForm() {
    const contactButton = document.querySelector('.contact-button');
    
    if (contactButton) {
        contactButton.addEventListener('click', function(e) {
            // Add phone number or contact modal functionality here
            console.log('Contact button clicked');
        });
    }
}

// Utility function for lazy loading images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Error handling for missing images
function handleImageErrors() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
            // You can add fallback image here if needed
            // this.src = 'images/fallback.png';
        });
    });
}

// Initialize error handling when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    handleImageErrors();
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Clean up intervals when page is unloaded
window.addEventListener('beforeunload', function() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
});

// Handle visibility change (pause slideshow when tab is not active)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        pauseSlideshow();
    } else {
        // Resume slideshow after 3 seconds when tab becomes active
        setTimeout(() => {
            if (isPaused) {
                resumeSlideshow();
            }
        }, 3000);
    }
});

// Keyboard navigation for slideshow
document.addEventListener('keydown', function(e) {
    const foldedSection = document.querySelector('.folded-section');
    if (!foldedSection) return;
    
    // Check if folded section is in viewport
    const rect = foldedSection.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInViewport) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                previousSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                break;
            case ' ':
                e.preventDefault();
                toggleSlideshow();
                break;
        }
    }
});

// Previous slide function
function previousSlide() {
    pauseSlideshow();
    currentSlideIndex = currentSlideIndex === 0 ? slideImages.length - 1 : currentSlideIndex - 1;
    
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage) {
        updateMainImage(slideImages[currentSlideIndex]);
    }
    
    // Update active thumbnail
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentSlideIndex);
    });
}