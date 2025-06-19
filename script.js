document.addEventListener("DOMContentLoaded", function () {
    const heroVideo = document.getElementById("hero-video");
    const heroSection = document.querySelector(".video-hero");

    let wasOutOfView = false;

    if (!heroVideo || !heroSection) return;

    let currentVideoSrc = '';
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    function switchVideoSource() {
        const isMobile = window.innerWidth < window.innerHeight;
        const desktopSource = document.getElementById("video-desktop");
        const mobileSource = document.getElementById("video-mobile");
        
        let newSrc = '';
        if (isMobile && mobileSource) {
            newSrc = mobileSource.src;
        } else if (!isMobile && desktopSource) {
            newSrc = desktopSource.src;
        }
        
        // Only change video if the source is actually different
        if (newSrc && newSrc !== currentVideoSrc) {
            currentVideoSrc = newSrc;
            heroVideo.src = newSrc;
            heroVideo.load();
            
            // Safari on mobile needs special handling
            if (isMobile && isSafari) {
                // Don't force play on Safari mobile, let it handle naturally
                return;
            }
            
            heroVideo.play().catch(e => console.log("Video autoplay prevented:", e));
        }
    }

    switchVideoSource();

    // Add debouncing to prevent excessive calls during resize
    // Disable resize listener on Safari mobile to prevent video restarts
    if (!(window.innerWidth < window.innerHeight && isSafari)) {
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(switchVideoSource, 250);
        });
    }

    // Only set up intersection observer for desktop devices (and not Safari mobile)
    const initialIsMobile = window.innerWidth < window.innerHeight;
    
    if (!initialIsMobile && !(initialIsMobile && isSafari)) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Double check we're still on desktop
                    const isMobile = window.innerWidth < window.innerHeight;
                    if (isMobile) {
                        return;
                    }
                    
                    if (!entry.isIntersecting && entry.intersectionRatio === 0) {
                        setTimeout(() => {
                            if (!entry.isIntersecting) {
                                wasOutOfView = true;
                            }
                        }, 500);
                    }
                    if (entry.isIntersecting && wasOutOfView && entry.intersectionRatio > 0.1) {
                        heroVideo.currentTime = 0;
                        heroVideo.play();
                        wasOutOfView = false;
                    }
                });
            },
            {
                threshold: [0, 0.1, 0.5, 1.0],
                rootMargin: '-50px 0px -50px 0px'
            }
        );

        observer.observe(heroSection);
    }
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    
    // Hide all testimonials except the first one
    function hideAllTestimonials() {
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
    }
    
    // Show the current testimonial
    function showTestimonial(index) {
        hideAllTestimonials();
        testimonials[index].style.display = 'block';
        
        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }
    
    // Initialize slider
    hideAllTestimonials();
    showTestimonial(currentSlide);
    
    // Next button click
    nextBtn.addEventListener('click', function() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showTestimonial(currentSlide);
    });
    
    // Previous button click
    prevBtn.addEventListener('click', function() {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentSlide);
    });
    
    // Dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            showTestimonial(currentSlide);
        });
    });
    
    // Auto slide every 5 seconds
    setInterval(function() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showTestimonial(currentSlide);
    }, 5000);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect is now handled by the earlier scroll event listener
    
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.feature-card, .step, .language-item');
    
    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.8;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state for reveal elements
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Check on load and scroll
    window.addEventListener('load', checkReveal);
    window.addEventListener('scroll', checkReveal);
});
