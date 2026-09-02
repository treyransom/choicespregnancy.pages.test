// ===================================
// Choices Pregnancy Care Center
// Interactive JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Clean up any leftover dark mode from previous visits
    document.documentElement.classList.remove('dark-mode');
    localStorage.removeItem('darkMode');

    initCrisisBanner();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initChatWidget();
    initAppointmentModal();
    initFAQ();
    initLanguageToggle();
    initSupportTabs();
    initLocationTabs();
    initEmergencyBar();
    initTestimonialCarousel();
    initPageLoader();
    initCounterAnimation();
    initFAQSearch();
    initStatusBadge();
    initGalleryLightbox();
    initGiveTabs();
    initDonationPicker();
    initVolunteerForm();
    initImpactStats();
    initUpcomingSessions();
    initMobileUnitSchedule();
    initBackToTop();
    initNewsletter();
    // Init scroll animations AFTER dynamic content is generated
    initScrollAnimations();
    initAccessibilityToolbar();
    initIntakeFlow();
    initQuiz();
    initTextWidget();
    initAnalyticsEvents();
});

// ===================================
// Crisis Banner
// ===================================
function initCrisisBanner() {
    const crisisBanner = document.getElementById('crisisBanner');
    const crisisClose = document.getElementById('crisisClose');
    const navbar = document.getElementById('navbar');

    if (!crisisBanner || !crisisClose) return;

    const bannerClosed = sessionStorage.getItem('crisisBannerClosed');

    if (bannerClosed) {
        crisisBanner.classList.add('hidden');
    }

    crisisClose.addEventListener('click', () => {
        crisisBanner.classList.add('hidden');
        sessionStorage.setItem('crisisBannerClosed', 'true');
    });
}

// ===================================
// Navbar Scroll Effect
// ===================================
function initNavbar() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===================================
// Mobile Menu Toggle
// ===================================
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking any link (all items are visible, no accordions)
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Skip sub-dropdown parent links on mobile (they're just labels)
            if (window.innerWidth <= 768 && link.closest('.nav-sub-dropdown') && link.parentElement.classList.contains('nav-sub-dropdown')) {
                return;
            }
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ===================================
// Smooth Scrolling
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service-card, .sh-card, .pa-service, .step, .review-card, .value, .contact-item, .trust-item, .faq-item, .impact-stat, .supply-item, .volunteer-role, .resource-article, .gallery-item, .session-card, .mobile-stop-card, .intake-card, .trust-badge-card, .transit-option, .quiz-card, .option-card'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index % 4 * 0.1}s`;
        observer.observe(el);
    });
}

// ===================================
// Tawk.to Live Chat Integration
// ===================================
function initTawkTo() {
    // Replace TAWK_PROPERTY_ID and TAWK_WIDGET_ID with your actual Tawk.to credentials
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();
    var s1 = document.createElement('script');
    var s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/TAWK_PROPERTY_ID/TAWK_WIDGET_ID';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
}

// ===================================
// Chat Widget (Custom Keyword Bot)
// ===================================
function initChatWidget() {
    const chatWidget = document.getElementById('chatWidget');
    const chatToggle = document.getElementById('chatToggle');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    const quickReplies = document.querySelectorAll('.quick-reply');

    if (!chatWidget || !chatToggle) return;

    // Toggle chat
    chatToggle.addEventListener('click', () => {
        chatWidget.classList.toggle('active');
        if (chatWidget.classList.contains('active')) {
            chatInput?.focus();
        }
    });

    chatClose?.addEventListener('click', () => {
        chatWidget.classList.remove('active');
    });

    // Send message
    function sendMessage(text) {
        if (!text.trim()) return;

        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.innerHTML = `<div class="message-content"><p>${escapeHtml(text)}</p></div>`;
        chatMessages.appendChild(userMessage);

        // Clear input and quick replies
        if (chatInput) chatInput.value = '';
        const quickRepliesContainer = chatMessages.querySelector('.chat-quick-replies');
        if (quickRepliesContainer) {
            quickRepliesContainer.remove();
        }

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Bot response after delay
        setTimeout(() => {
            const botResponse = getBotResponse(text);
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot';
            botMessage.innerHTML = `<div class="message-content"><p>${botResponse}</p></div>`;
            chatMessages.appendChild(botMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }

    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('pregnancy test') || lowerMessage.includes('pregnant')) {
            return "We offer free, confidential pregnancy tests with results while you wait. Call us at <a href='tel:7705351245'>770-535-1245</a> or click Schedule to book an appointment.";
        } else if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
            return "We offer free pregnancy tests, ultrasounds, STI testing, options counseling, and the Bright Course program. All services are confidential and free!";
        } else if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
            return "You can schedule by calling <a href='tel:7705351245'>770-535-1245</a> or using our online scheduler. Same-day appointments are often available!";
        } else if (lowerMessage.includes('option') || lowerMessage.includes('help')) {
            return "We provide information about all your options without pressure or judgment. Would you like to come in for a confidential consultation?";
        } else if (lowerMessage.includes('cost') || lowerMessage.includes('free') || lowerMessage.includes('pay')) {
            return "All of our services are completely FREE! We're a nonprofit and you'll never be asked to pay.";
        } else {
            return "Thank you for reaching out! Call us at <a href='tel:7705351245'>770-535-1245</a> for the fastest response. We're here to help!";
        }
    }

    chatSend?.addEventListener('click', () => sendMessage(chatInput?.value || ''));

    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(chatInput.value);
        }
    });

    quickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            sendMessage(btn.dataset.message);
        });
    });
}

// ===================================
// Appointment Modal
// ===================================
function initAppointmentModal() {
    const modal = document.getElementById('scheduleModal');
    const modalClose = document.getElementById('modalClose');
    const scheduleBtn = document.getElementById('scheduleBtn');
    const heroScheduleBtn = document.getElementById('heroScheduleBtn');
    const scheduleTriggers = document.querySelectorAll('.schedule-trigger');
    const appointmentForm = document.getElementById('appointmentForm');

    if (!modal) return;

    // Set minimum date to today
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    scheduleBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    heroScheduleBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    scheduleTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    modalClose?.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    appointmentForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = appointmentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Simulate submission
        setTimeout(() => {
            closeModal();
            appointmentForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success message
            showNotification('Appointment request submitted! We will call you to confirm.', 'success');
        }, 1500);
    });
}

// ===================================
// FAQ Accordion
// ===================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            question.setAttribute('aria-expanded', !isActive);
        });
    });
}

// ===================================
// Language Toggle
// ===================================
function initLanguageToggle() {
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = 'en';

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newLang = btn.dataset.lang;
            if (newLang === currentLang) return;

            // Update active state
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = newLang;

            // Update all translatable elements
            document.querySelectorAll('[data-en][data-es]').forEach(el => {
                const text = el.getAttribute(`data-${newLang}`);
                if (text) {
                    el.innerHTML = text;
                }
            });

            // Update placeholders
            document.querySelectorAll('[data-en-placeholder][data-es-placeholder]').forEach(el => {
                const placeholder = el.getAttribute(`data-${newLang}-placeholder`);
                if (placeholder) {
                    el.placeholder = placeholder;
                }
            });

            // Update document language
            document.documentElement.lang = newLang;
        });
    });
}

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 24px;
                padding: 16px 24px;
                background: #10b981;
                color: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                z-index: 3000;
                display: flex;
                align-items: center;
                gap: 16px;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.8;
            }
            .notification-close:hover { opacity: 1; }
            @keyframes slideIn {
                from { opacity: 0; transform: translateX(100px); }
                to { opacity: 1; transform: translateX(0); }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===================================
// Support People Tabs
// ===================================
function initSupportTabs() {
    const tabs = document.querySelectorAll('.support-tab');
    const panels = document.querySelectorAll('.support-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.dataset.tab;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active panel
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `panel-${targetPanel}`) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

// ===================================
// Emergency Bar
// ===================================
function initEmergencyBar() {
    const bar = document.getElementById('emergencySticky');
    const closeBtn = document.getElementById('emergencyClose');
    const emergencyChatBtn = document.getElementById('emergencyChatBtn');
    const chatWidget = document.getElementById('chatWidget');

    if (closeBtn && bar) {
        if (sessionStorage.getItem('emergencyBarClosed')) {
            bar.classList.add('hidden');
        }

        closeBtn.addEventListener('click', () => {
            bar.classList.add('hidden');
            sessionStorage.setItem('emergencyBarClosed', 'true');
        });
    }

    if (emergencyChatBtn && chatWidget) {
        emergencyChatBtn.addEventListener('click', () => {
            chatWidget.classList.add('active');
        });
    }
}

// ===================================
// Testimonial Carousel
// ===================================
function initTestimonialCarousel() {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoplayTimer;
    const autoplayDelay = 5000;

    function getSlidesPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getMaxIndex() {
        return Math.max(0, slides.length - getSlidesPerView());
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        const totalPositions = getMaxIndex() + 1;
        for (let i = 0; i < totalPositions; i++) {
            const dot = document.createElement('button');
            dot.classList.add('testimonial-dot');
            dot.setAttribute('aria-label', 'Go to testimonial group ' + (i + 1));
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goTo(index) {
        const maxIndex = getMaxIndex();
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        const slideWidth = slides[0].offsetWidth + 16; // width + gap
        track.style.transform = 'translateX(-' + (currentIndex * slideWidth) + 'px)';
        updateDots();
    }

    function next() {
        if (currentIndex >= getMaxIndex()) {
            goTo(0);
        } else {
            goTo(currentIndex + 1);
        }
    }

    function prev() {
        if (currentIndex <= 0) {
            goTo(getMaxIndex());
        } else {
            goTo(currentIndex - 1);
        }
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(next, autoplayDelay);
    }

    function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
    }

    prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
    nextBtn.addEventListener('click', () => { next(); startAutoplay(); });

    const carousel = document.querySelector('.testimonial-carousel');
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) next(); else prev();
        }
        startAutoplay();
    }, { passive: true });

    // Recalculate on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
            buildDots();
            goTo(currentIndex);
        }, 200);
    });

    buildDots();
    goTo(0);
    startAutoplay();
}

// ===================================
// Page Loader
// ===================================
function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }, 300);
    });

    // Fallback: hide after 3s even if load event already fired
    setTimeout(() => {
        if (loader.parentElement) {
            loader.classList.add('hidden');
            setTimeout(() => { if (loader.parentElement) loader.remove(); }, 500);
        }
    }, 3000);
}

// ===================================
// Animated Counter (Trust Bar)
// ===================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.trust-number[data-target]');
    if (counters.length === 0) return;

    let animated = false;

    function animateCounters() {
        if (animated) return;
        animated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const prefix = counter.dataset.prefix || '';
            const suffix = counter.dataset.suffix || '';
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                const current = Math.round(target * eased);
                counter.textContent = prefix + current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const trustBar = document.querySelector('.trust-bar');
    if (trustBar) observer.observe(trustBar);
}

// ===================================
// FAQ Search/Filter
// ===================================
function initFAQSearch() {
    const searchInput = document.getElementById('faqSearchInput');
    const faqItems = document.querySelectorAll('.faq-item');
    const noResults = document.getElementById('faqNoResults');

    if (!searchInput || faqItems.length === 0) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question span')?.textContent.toLowerCase() || '';
            const answer = item.querySelector('.faq-answer p')?.textContent.toLowerCase() || '';

            if (query === '' || question.includes(query) || answer.includes(query)) {
                item.classList.remove('faq-hidden');
                visibleCount++;
            } else {
                item.classList.add('faq-hidden');
                item.classList.remove('active');
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 && query !== '' ? 'block' : 'none';
        }
    });
}

// ===================================
// Open/Closed Status Badge
// ===================================
function initStatusBadge() {
    const navBadge = document.getElementById('navStatusBadge');
    const contactBadge = document.getElementById('contactStatusBadge');

    function updateStatus() {
        const now = new Date();
        const day = now.getDay(); // 0=Sun, 1=Mon, ... 4=Thu
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hour + minutes / 60;

        // Open Mon-Thu (1-4), 9am-4pm
        const isOpen = day >= 1 && day <= 4 && currentTime >= 9 && currentTime < 16;

        const statusClass = isOpen ? 'open' : 'closed';
        const statusText = isOpen ? 'Open Now' : 'Closed';
        const statusTextEs = isOpen ? 'Abierto' : 'Cerrado';

        [navBadge, contactBadge].forEach(badge => {
            if (!badge) return;
            badge.className = badge.className.replace(/\bopen\b|\bclosed\b/g, '').trim();
            badge.classList.add('status-badge', statusClass);
            if (badge.id === 'contactStatusBadge') badge.classList.add('status-badge-contact');
            badge.textContent = statusText;
            badge.setAttribute('data-en', statusText);
            badge.setAttribute('data-es', statusTextEs);
        });
    }

    updateStatus();
    setInterval(updateStatus, 60000); // Update every minute
}

// ===================================
// Gallery Lightbox
// ===================================
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = lightbox?.querySelector('.lightbox-close');
    const prevBtn = lightbox?.querySelector('.lightbox-prev');
    const nextBtn = lightbox?.querySelector('.lightbox-next');

    if (!lightbox || galleryItems.length === 0) return;

    let currentGalleryIndex = 0;
    const items = Array.from(galleryItems);

    function openLightbox(index) {
        currentGalleryIndex = index;
        const item = items[index];
        const img = item.querySelector('img');
        const caption = item.dataset.caption || '';

        // Use higher resolution version
        lightboxImg.src = img.src.replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=800');
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function nextImage() {
        currentGalleryIndex = (currentGalleryIndex + 1) % items.length;
        openLightbox(currentGalleryIndex);
    }

    function prevImage() {
        currentGalleryIndex = (currentGalleryIndex - 1 + items.length) % items.length;
        openLightbox(currentGalleryIndex);
    }

    items.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn?.addEventListener('click', closeLightbox);
    nextBtn?.addEventListener('click', nextImage);
    prevBtn?.addEventListener('click', prevImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
}

// initDonorCounter removed — replaced by initImpactStats

// ===================================
// Upcoming Sessions Calendar
// ===================================
function initUpcomingSessions() {
    const grid = document.getElementById('sessionsGrid');
    if (!grid) return;

    const sessions = generateUpcomingSessions();
    grid.innerHTML = sessions.map(buildSessionCard).join('');

    // Wire up enroll buttons to open the appointment modal
    grid.querySelectorAll('.session-enroll').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('scheduleModal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                const typeSelect = document.getElementById('appointmentType');
                if (typeSelect) typeSelect.value = 'bright-course';
            }
        });
    });
}

function generateUpcomingSessions() {
    const now = new Date();
    const sessions = [];
    const topics = [
        { title: 'Prenatal Health & Nutrition', icon: '🍎' },
        { title: 'Newborn Care Basics', icon: '👶' },
        { title: 'Budgeting for Baby', icon: '💰' },
        { title: 'Infant CPR & Safety', icon: '🩺' },
        { title: 'Breastfeeding 101', icon: '🤱' },
        { title: 'Emotional Wellness for Moms', icon: '💚' }
    ];

    // Generate 3 upcoming Tuesday sessions (Bright Course runs on Tuesdays)
    let date = new Date(now);
    // Find the next Tuesday
    const dayOfWeek = date.getDay();
    const daysUntilTuesday = (2 - dayOfWeek + 7) % 7 || 7;
    date.setDate(date.getDate() + daysUntilTuesday);

    for (let i = 0; i < 3; i++) {
        const sessionDate = new Date(date);
        sessionDate.setDate(sessionDate.getDate() + i * 14); // Every 2 weeks

        const totalSpots = 12;
        // Closer dates have fewer spots remaining
        const spotsLeft = i === 0 ? 3 : i === 1 ? 7 : 11;
        const topic = topics[i % topics.length];

        sessions.push({
            date: sessionDate,
            title: topic.title,
            icon: topic.icon,
            time: '10:00 AM - 12:00 PM',
            location: '225 Forrest Ave, Gainesville',
            totalSpots: totalSpots,
            spotsLeft: spotsLeft
        });
    }

    return sessions;
}

function buildSessionCard(session) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const month = months[session.date.getMonth()];
    const day = session.date.getDate();
    const weekday = weekdays[session.date.getDay()];
    const filled = session.totalSpots - session.spotsLeft;
    const fillPercent = Math.round((filled / session.totalSpots) * 100);
    const isFilling = session.spotsLeft <= 4;

    const badgeClass = isFilling ? 'filling' : 'open';
    const badgeText = isFilling ? 'Filling Up' : 'Open';

    return '<div class="session-card">' +
        '<span class="session-card-badge ' + badgeClass + '">' + badgeText + '</span>' +
        '<div class="session-date-block">' +
            '<span class="session-month">' + month + '</span>' +
            '<span class="session-day">' + day + '</span>' +
            '<span class="session-weekday">' + weekday + '</span>' +
        '</div>' +
        '<div class="session-details">' +
            '<div class="session-title">' + session.icon + ' ' + session.title + '</div>' +
            '<div class="session-meta">' +
                '<div class="session-meta-item">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' +
                    '<span>' + session.time + '</span>' +
                '</div>' +
                '<div class="session-meta-item">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
                    '<span>' + session.location + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="session-spots">' +
                '<div class="session-spots-bar">' +
                    '<div class="session-spots-fill' + (isFilling ? ' filling' : '') + '" style="width: ' + fillPercent + '%"></div>' +
                '</div>' +
                '<span class="session-spots-text">' + session.spotsLeft + '/' + session.totalSpots + ' spots</span>' +
            '</div>' +
            '<button class="session-enroll">Reserve Your Spot</button>' +
        '</div>' +
    '</div>';
}

// ===================================
// Give Tabs (Donate / Volunteer / Supplies)
// ===================================
function initGiveTabs() {
    var tabs = document.querySelectorAll('.give-tab');
    var panels = document.querySelectorAll('.give-panel');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var target = tab.dataset.giveTab;

            tabs.forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');

            panels.forEach(function(panel) {
                panel.classList.remove('active');
                if (panel.id === 'panel-' + target) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

// ===================================
// Donation Amount Picker
// ===================================
function initDonationPicker() {
    var amountBtns = document.querySelectorAll('.donate-amount');
    var customInput = document.getElementById('customAmount');
    var submitBtn = document.querySelector('.donate-submit-btn');
    var freqBtns = document.querySelectorAll('.freq-btn');

    if (!submitBtn || amountBtns.length === 0) return;

    var selectedAmount = 75;
    var frequency = 'once';

    function updateSubmitBtn() {
        var label = frequency === 'monthly' ? '/mo' : '';
        submitBtn.textContent = 'Donate $' + selectedAmount + label;
        submitBtn.setAttribute('data-en', 'Donate $' + selectedAmount + label);
        submitBtn.setAttribute('data-es', 'Donar $' + selectedAmount + label);
    }

    amountBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            amountBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedAmount = parseInt(btn.dataset.amount);
            if (customInput) customInput.value = '';
            updateSubmitBtn();
        });
    });

    if (customInput) {
        customInput.addEventListener('input', function() {
            var val = parseInt(customInput.value);
            if (val > 0) {
                amountBtns.forEach(function(b) { b.classList.remove('active'); });
                selectedAmount = val;
                updateSubmitBtn();
            }
        });
    }

    freqBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            freqBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            frequency = btn.dataset.freq;
            updateSubmitBtn();
        });
    });

    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Thank you for your generous gift of $' + selectedAmount + '! You\'re making a real difference.', 'success');
        });
    }
}

// ===================================
// Volunteer Form
// ===================================
function initVolunteerForm() {
    var form = document.getElementById('volunteerForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var submitBtn = form.querySelector('button[type="submit"]');
        var originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        setTimeout(function() {
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showNotification('Thank you for your interest in volunteering! We\'ll be in touch soon.', 'success');
        }, 1200);
    });
}

// ===================================
// Impact Stats Counter
// ===================================
function initImpactStats() {
    var statsRow = document.getElementById('impactStatsRow');
    if (!statsRow) return;

    var counters = statsRow.querySelectorAll('.impact-stat-number');
    if (counters.length === 0) return;

    var animated = false;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !animated) {
                animated = true;

                counters.forEach(function(counter) {
                    var target = parseInt(counter.dataset.target) || 0;
                    var suffix = counter.dataset.suffix || '';
                    var duration = 2200;
                    var start = performance.now();

                    function update(now) {
                        var elapsed = now - start;
                        var progress = Math.min(elapsed / duration, 1);
                        var eased = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.round(target * eased).toLocaleString() + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        }
                    }

                    requestAnimationFrame(update);
                });

                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsRow);
}

// ===================================
// Newsletter Signup
// ===================================
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('nlEmailInput');
    const phoneInput = document.getElementById('nlPhoneInput');
    const toggleBtns = document.querySelectorAll('.nl-toggle-btn');

    if (!form) return;

    var currentType = 'email';

    toggleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var type = btn.dataset.nlType;
            if (type === currentType) return;
            currentType = type;

            toggleBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            if (type === 'email') {
                emailInput.style.display = '';
                emailInput.required = true;
                phoneInput.style.display = 'none';
                phoneInput.required = false;
            } else {
                emailInput.style.display = 'none';
                emailInput.required = false;
                phoneInput.style.display = '';
                phoneInput.required = true;
            }
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var submitBtn = form.querySelector('.newsletter-submit');
        var originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        setTimeout(function() {
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showNotification('You\'re subscribed! Watch for updates from Choices.', 'success');
        }, 1200);
    });
}

// ===================================
// Back to Top
// ===================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===================================
// Location Tabs
// ===================================
function initLocationTabs() {
    const tabs = document.querySelectorAll('.location-tab');
    const panels = document.querySelectorAll('.location-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.dataset.locTab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === 'panel-' + targetPanel) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

// ===================================
// Mobile Unit Schedule
// ===================================
function initMobileUnitSchedule() {
    const grid = document.getElementById('mobileStopsGrid');
    if (!grid) return;

    const stops = generateUpcomingStops();
    grid.innerHTML = stops.map(buildMobileStopCard).join('');
}

function generateUpcomingStops() {
    const scheduleData = [
        { dayOfWeek: 1, name: 'Hall County Library', address: '127 Main St NW, Gainesville', time: '10:00 AM – 2:00 PM', services: ['STI Testing', 'Pregnancy Tests'] },
        { dayOfWeek: 3, name: 'Lanier Technical College', address: '2535 Lanier Tech Dr, Gainesville', time: '9:00 AM – 1:00 PM', services: ['STI Testing', 'Resources'] },
        { dayOfWeek: 4, name: 'Gainesville Housing Authority', address: '750 Pearl Nix Pkwy, Gainesville', time: '10:00 AM – 2:00 PM', services: ['Pregnancy Tests', 'Counseling'] }
    ];

    const stops = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const searchDate = new Date(now);

    while (stops.length < 4) {
        searchDate.setDate(searchDate.getDate() + 1);
        const dow = searchDate.getDay();
        const match = scheduleData.find(s => s.dayOfWeek === dow);
        if (match) {
            stops.push({
                date: new Date(searchDate),
                name: match.name,
                address: match.address,
                time: match.time,
                services: match.services
            });
        }
    }

    return stops;
}

function buildMobileStopCard(stop) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const weekday = weekdays[stop.date.getDay()];
    const day = stop.date.getDate();
    const month = months[stop.date.getMonth()];

    var tagsHtml = '';
    stop.services.forEach(function(service) {
        tagsHtml += '<span class="mobile-stop-tag">' + service + '</span>';
    });

    return '<div class="mobile-stop-card">' +
        '<div class="mobile-stop-date">' +
            '<span class="mobile-stop-weekday">' + weekday + '</span>' +
            '<span class="mobile-stop-day">' + day + '</span>' +
            '<span class="mobile-stop-month">' + month + '</span>' +
        '</div>' +
        '<div class="mobile-stop-info">' +
            '<div class="mobile-stop-name">' + stop.name + '</div>' +
            '<div class="mobile-stop-address">' + stop.address + '</div>' +
            '<div class="mobile-stop-time">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' +
                '<span>' + stop.time + '</span>' +
            '</div>' +
            '<div class="mobile-stop-tags">' + tagsHtml + '</div>' +
        '</div>' +
    '</div>';
}

// ===================================
// PWA Install Prompt
// ===================================
function initPWAInstall() {
    const banner = document.getElementById('pwaInstallBanner');
    const installBtn = document.getElementById('pwaInstallBtn');
    const dismissBtn = document.getElementById('pwaDismissBtn');

    if (!banner || !installBtn || !dismissBtn) return;

    // Don't show if already dismissed this session
    if (sessionStorage.getItem('pwaInstallDismissed')) return;

    // Don't show if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) return;

    var deferredPrompt = null;

    // Android / Chrome: capture the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        banner.classList.add('visible');
    });

    // iOS detection: show banner with instructions since iOS has no beforeinstallprompt
    var isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
        // Delay slightly so page loads first
        setTimeout(function() {
            installBtn.textContent = 'How to Install';
            banner.classList.add('visible');
        }, 2000);
    }

    // Install button click
    installBtn.addEventListener('click', function() {
        if (deferredPrompt) {
            // Android / Chrome: trigger native install prompt
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function(result) {
                deferredPrompt = null;
                banner.classList.remove('visible');
            });
        } else if (isIOS) {
            // iOS: show manual instructions
            banner.classList.remove('visible');
            showIOSInstallInstructions();
        }
    });

    // Dismiss button click
    dismissBtn.addEventListener('click', function() {
        banner.classList.remove('visible');
        sessionStorage.setItem('pwaInstallDismissed', 'true');
    });

    // Hide banner if app gets installed
    window.addEventListener('appinstalled', function() {
        banner.classList.remove('visible');
        deferredPrompt = null;
    });
}

function showIOSInstallInstructions() {
    var overlay = document.createElement('div');
    overlay.className = 'ios-install-overlay';
    overlay.innerHTML =
        '<div class="ios-install-modal">' +
            '<h3>Install Choices App</h3>' +
            '<p>To add this app to your home screen:</p>' +
            '<ol>' +
                '<li>Tap the <strong>Share</strong> button <span style="font-size:1.2em">⎋</span> at the bottom of Safari</li>' +
                '<li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>' +
                '<li>Tap <strong>"Add"</strong> in the top right</li>' +
            '</ol>' +
            '<button class="ios-install-close">Got it</button>' +
        '</div>';

    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(function() {
        overlay.classList.add('visible');
    });

    // Close handler
    overlay.querySelector('.ios-install-close').addEventListener('click', function() {
        overlay.classList.remove('visible');
        setTimeout(function() {
            overlay.remove();
        }, 300);
    });

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.classList.remove('visible');
            setTimeout(function() {
                overlay.remove();
            }, 300);
        }
    });
}

// ===================================
// Utility Functions
// ===================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// ===================================
// Accessibility Toolbar
// ===================================
function initAccessibilityToolbar() {
    const toolbar = document.getElementById('a11yToolbar');
    const toggleBtn = document.getElementById('a11yToggle');
    const closeBtn = document.getElementById('a11yClose');
    const fontDecrease = document.getElementById('fontDecrease');
    const fontReset = document.getElementById('fontReset');
    const fontIncrease = document.getElementById('fontIncrease');
    const highContrastToggle = document.getElementById('highContrastToggle');
    const readingGuideToggle = document.getElementById('readingGuideToggle');
    const readingGuideLine = document.getElementById('readingGuideLine');

    if (!toolbar || !toggleBtn) return;

    let fontSize = parseInt(localStorage.getItem('a11yFontSize')) || 100;
    let highContrast = localStorage.getItem('a11yHighContrast') === '1';
    let readingGuide = false;

    function applyFontSize() {
        document.documentElement.style.fontSize = fontSize + '%';
        localStorage.setItem('a11yFontSize', fontSize);
    }

    function applyHighContrast() {
        document.documentElement.classList.toggle('high-contrast', highContrast);
        highContrastToggle.setAttribute('aria-checked', highContrast);
        localStorage.setItem('a11yHighContrast', highContrast ? '1' : '0');
    }

    function applyReadingGuide() {
        readingGuideLine.classList.toggle('active', readingGuide);
        readingGuideToggle.setAttribute('aria-checked', readingGuide);
    }

    // Apply saved settings
    if (fontSize !== 100) applyFontSize();
    if (highContrast) applyHighContrast();

    toggleBtn.addEventListener('click', () => {
        toolbar.classList.toggle('active');
    });

    closeBtn?.addEventListener('click', () => {
        toolbar.classList.remove('active');
    });

    fontDecrease?.addEventListener('click', () => {
        fontSize = Math.max(75, fontSize - 10);
        applyFontSize();
    });

    fontReset?.addEventListener('click', () => {
        fontSize = 100;
        applyFontSize();
    });

    fontIncrease?.addEventListener('click', () => {
        fontSize = Math.min(150, fontSize + 10);
        applyFontSize();
    });

    highContrastToggle?.addEventListener('click', () => {
        highContrast = !highContrast;
        applyHighContrast();
    });

    readingGuideToggle?.addEventListener('click', () => {
        readingGuide = !readingGuide;
        applyReadingGuide();
    });

    // Reading guide follows mouse
    document.addEventListener('mousemove', (e) => {
        if (readingGuide && readingGuideLine) {
            readingGuideLine.style.top = e.clientY + 'px';
        }
    });
}

// ===================================
// Intake Flow
// ===================================
function initIntakeFlow() {
    const cards = document.querySelectorAll('.intake-card');
    const results = document.querySelectorAll('.intake-result');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.intake;

            // Toggle active card
            cards.forEach(c => c.classList.toggle('active', c === card));

            // Show matching result
            results.forEach(r => {
                const id = r.id.replace('intake-result-', '');
                if (id === type) {
                    r.style.display = 'block';
                    r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    r.style.display = 'none';
                }
            });
        });
    });
}

// ===================================
// Self-Assessment Quiz
// ===================================
function initQuiz() {
    const quizBody = document.getElementById('quizBody');
    const progressBar = document.getElementById('quizProgressBar');
    const resultPanel = document.getElementById('quizResult');
    const resultIcon = document.getElementById('quizResultIcon');
    const resultTitle = document.getElementById('quizResultTitle');
    const resultText = document.getElementById('quizResultText');
    const restartBtn = document.getElementById('quizRestart');

    if (!quizBody) return;

    const questions = quizBody.querySelectorAll('.quiz-question');
    const totalQuestions = questions.length;
    let currentQ = 0;
    let score = 0;
    let flags = [];

    function updateProgress() {
        const pct = ((currentQ) / totalQuestions) * 100;
        if (progressBar) progressBar.style.width = pct + '%';
    }

    function showQuestion(index) {
        questions.forEach((q, i) => {
            q.classList.toggle('active', i === index);
        });
        updateProgress();
    }

    function showResult() {
        trackEvent('quiz-completed');
        questions.forEach(q => q.classList.remove('active'));
        if (progressBar) progressBar.style.width = '100%';

        const notActive = flags.includes('not-active');
        let icon, title, text;

        if (notActive) {
            icon = '<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>';
            title = 'Pregnancy is unlikely based on your answers';
            text = 'Since you have not been sexually active recently, pregnancy is very unlikely. The symptoms you may be experiencing could have other causes. If anything changes or you have concerns, we are always here to help — all services are free and confidential.';
        } else if (score >= 14) {
            icon = '<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';
            title = 'Multiple strong signs of possible pregnancy';
            text = 'Based on your answers, you are experiencing several key early pregnancy indicators. We strongly recommend coming in for a free, confidential pregnancy test — results take just minutes and can give you clarity.';
        } else if (score >= 8) {
            icon = '<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';
            title = 'Some signs may indicate pregnancy';
            text = 'You are experiencing symptoms that are commonly associated with early pregnancy. A free pregnancy test is the most reliable way to know for sure. It only takes a few minutes and is completely confidential.';
        } else if (score >= 4) {
            icon = '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';
            title = 'A few possible signs — a test can help';
            text = 'Your symptoms are mild, but pregnancy is still possible. Since you have been sexually active, a free test is the best way to know for certain and get peace of mind.';
        } else {
            icon = '<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>';
            title = 'Fewer signs of pregnancy at this time';
            text = 'Based on your answers, you have fewer common pregnancy symptoms. However, every body is different. If you have any concerns, a free test can give you peace of mind.';
        }

        resultIcon.innerHTML = icon;
        resultTitle.textContent = title;
        resultText.textContent = text;
        resultPanel.style.display = 'block';
    }

    // Handle answer clicks
    quizBody.addEventListener('click', (e) => {
        const answerBtn = e.target.closest('.quiz-answer');
        if (!answerBtn) return;

        score += parseInt(answerBtn.dataset.score) || 0;
        if (answerBtn.dataset.flag) flags.push(answerBtn.dataset.flag);
        currentQ++;

        if (currentQ >= totalQuestions) {
            showResult();
        } else {
            showQuestion(currentQ);
        }
    });

    restartBtn?.addEventListener('click', () => {
        score = 0;
        currentQ = 0;
        flags = [];
        resultPanel.style.display = 'none';
        showQuestion(0);
    });

    showQuestion(0);
}

// ===================================
// Text Us Widget
// ===================================
function initTextWidget() {
    const widget = document.getElementById('textWidget');
    const bubble = document.getElementById('textWidgetBubble');
    const closeBtn = document.getElementById('textWidgetClose');

    if (!widget || !bubble) return;

    // Show after 10 seconds if not dismissed
    if (sessionStorage.getItem('textWidgetDismissed')) return;

    setTimeout(() => {
        bubble.classList.add('visible');
    }, 10000);

    closeBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        bubble.classList.remove('visible');
        sessionStorage.setItem('textWidgetDismissed', 'true');
    });
}

// ===================================
// Cornerstone-Style Animations
// ===================================

function initCornerstoneEffects() {
    // 1. Scroll Progress Bar
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (scrollTop / docHeight * 100) + '%';
        });
    }

    // 2. Hero Content Staggered Entrance (like Cornerstone's GSAP timeline)
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Small delay to ensure page has rendered
        setTimeout(() => heroContent.classList.add('animate'), 300);
    }

    // 3. Parallax Hero — subtle scale only, no translateY to avoid gap
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    const heroHeight = document.querySelector('.hero')?.offsetHeight || 800;
                    if (scrolled < heroHeight) {
                        const progress = scrolled / heroHeight;
                        heroBg.style.transform = 'scale(' + (1 + progress * 0.08) + ')';
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // 4. Scroll-triggered element reveals (IntersectionObserver)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve — keep it visible once revealed
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    // Observe all animatable elements
    document.querySelectorAll('.anim-up, .batch-card, .section-header, .line-reveal, .color-fill').forEach(el => {
        revealObserver.observe(el);
    });

    // 5. Footer entrance (like Cornerstone — slides up from below)
    const footer = document.querySelector('.footer');
    if (footer) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.classList.add('visible');
                    footerObserver.unobserve(footer);
                }
            });
        }, { threshold: 0.05 });
        footerObserver.observe(footer);
    }

    // 6. Line-by-line text reveal (like Cornerstone's SplitText)
    document.querySelectorAll('.line-reveal').forEach(el => {
        // Split text into lines by wrapping each line of text
        const text = el.innerHTML;
        // Split on <br> tags
        if (text.includes('<br')) {
            const parts = text.split(/<br\s*\/?>/gi);
            el.innerHTML = parts.map(part => '<span class="line">' + part.trim() + '</span>').join('');
        }
    });

    // 7. Character color fill (like Cornerstone's SplitText color fill)
    document.querySelectorAll('.color-fill').forEach(el => {
        const text = el.textContent;
        el.innerHTML = text.split('').map((char, i) => {
            if (char === ' ') return ' ';
            return '<span class="char" style="transition-delay:' + (i * 0.03) + 's">' + char + '</span>';
        }).join('');
    });

    // 8. Add batch-card class to grid items for staggered entrance
    const cardSelectors = [
        '.services-grid .service-card',
        '.reviews-grid .review-card',
        '.steps-grid .step',
        '.intake-options .intake-card',
        '.events-grid .event-card'
    ];
    cardSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(card => {
            if (!card.classList.contains('batch-card')) {
                card.classList.add('batch-card');
                revealObserver.observe(card);
            }
        });
    });

    // 9. Add anim-up class to section headers that don't have it
    document.querySelectorAll('.section-header').forEach(header => {
        revealObserver.observe(header);
    });

    // 10. Infinite auto-scrolling carousels — duplicate items for seamless loop
    function initInfiniteScroll(trackSelector) {
        const track = document.querySelector(trackSelector);
        if (!track) return;
        const items = track.children;
        if (!items.length) return;
        // Clone all items and append for seamless loop
        const clones = [];
        for (let i = 0; i < items.length; i++) {
            clones.push(items[i].cloneNode(true));
        }
        clones.forEach(clone => track.appendChild(clone));
    }

    initInfiniteScroll('.reviews-track');
    initInfiniteScroll('.partners-track');

    // 12. Cornerstone ministries-style fly-in for service cards
    if (window.innerWidth >= 1024) {
        const serviceCards = document.querySelectorAll('.ministry-grid .ministry-card');
        if (serviceCards.length) {
            // Initial scattered positions — each card starts differently
            const flyConfigs = [
                { y: -1200, x: -250, rotate: -7, scale: 0.55 },
                { y: -1300, x: 225, rotate: 9, scale: 0.6 },
                { y: -1500, x: -180, rotate: -4, scale: 0.65 },
                { y: -1400, x: 250, rotate: 6, scale: 0.7 },
            ];

            serviceCards.forEach((card, i) => {
                const config = flyConfigs[i % flyConfigs.length];
                card.classList.add('fly-in');
                card.style.transform = `translateY(${config.y}px) translateX(${config.x}px) rotate(${config.rotate}deg) scale(${config.scale})`;
                card.style.opacity = '0';
            });

            const servicesSection = document.querySelector('.services-cinematic');
            if (servicesSection) {
                const sectionTop = () => servicesSection.getBoundingClientRect().top + window.scrollY;
                const sectionHeight = () => servicesSection.offsetHeight;

                let flyTicking = false;
                window.addEventListener('scroll', () => {
                    if (!flyTicking) {
                        requestAnimationFrame(() => {
                            const scrollY = window.scrollY;
                            const triggerStart = sectionTop() - window.innerHeight * 1.5;
                            const triggerEnd = sectionTop() + sectionHeight() * 0.4;
                            const range = triggerEnd - triggerStart;

                            if (scrollY >= triggerStart && scrollY <= triggerEnd + 200) {
                                const rawProgress = Math.min(Math.max((scrollY - triggerStart) / range, 0), 1);
                                // Sine easing
                                const progress = 0.5 - Math.cos(rawProgress * Math.PI) / 2;

                                serviceCards.forEach((card, i) => {
                                    const config = flyConfigs[i % flyConfigs.length];
                                    const delay = i * 0.12;
                                    const cardProgress = Math.min(Math.max((rawProgress - delay) / (1 - delay), 0), 1);
                                    const eased = 0.5 - Math.cos(cardProgress * Math.PI) / 2;

                                    const y = config.y * (1 - eased);
                                    const x = config.x * (1 - eased);
                                    const rotate = config.rotate * (1 - eased);
                                    const scale = config.scale + (1 - config.scale) * eased;
                                    const opacity = eased;

                                    card.style.transform = `translateY(${y}px) translateX(${x}px) rotate(${rotate}deg) scale(${scale})`;
                                    card.style.opacity = opacity;

                                    if (eased >= 0.95) card.classList.add('landed');
                                });
                            }
                            flyTicking = false;
                        });
                        flyTicking = true;
                    }
                });
            }
        }
    }

    // 11. Scatter event cards on scroll — Cornerstone style
    const scatterCards = document.querySelectorAll('.event-card-scatter');
    if (scatterCards.length) {
        const scatterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate each card to its data position
                    scatterCards.forEach((card, i) => {
                        const x = card.dataset.x || '0';
                        const y = card.dataset.y || '0';
                        const rotate = card.dataset.rotate || '0';

                        setTimeout(() => {
                            card.classList.add('scattered');
                            card.style.transform = 'translateX(' + x + ') translateY(' + y + ') rotate(' + rotate + 'deg)';
                        }, i * 120);
                    });
                    scatterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const scatterContainer = document.querySelector('.events-scatter');
        if (scatterContainer) scatterObserver.observe(scatterContainer);

        // Hover: lift and straighten
        if (window.innerWidth > 767) {
            scatterCards.forEach(card => {
                const origY = card.dataset.y || '0';
                const origRotate = card.dataset.rotate || '0';
                const origX = card.dataset.x || '0';

                card.addEventListener('mouseenter', () => {
                    const yVal = parseFloat(origY) - 8;
                    card.style.transform = 'translateX(' + origX + ') translateY(' + yVal + '%) rotate(0deg)';
                    card.style.transition = 'transform 0.3s cubic-bezier(0.37, 0, 0.63, 1), z-index 0s';
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateX(' + origX + ') translateY(' + origY + ') rotate(' + origRotate + 'deg)';
                });
            });
        }
    }

    // 13. Global subpage scroll reveals — auto-detect and animate cards/grids on ALL pages
    const globalGridSelectors = [
        '.services-grid',
        '.options-grid',
        '.team-grid',
        '.sh-cards-grid',
        '.faq-grid',
        '.gallery-grid',
        '.stories-grid',
        '.steps-grid',
        '.impact-stats-row',
        '.intake-options'
    ];

    globalGridSelectors.forEach(gridSelector => {
        const grid = document.querySelector(gridSelector);
        if (grid) {
            grid.classList.add('scroll-reveal-stagger');
            Array.from(grid.children).forEach(child => {
                child.classList.add('scroll-reveal');
                revealObserver.observe(child);
            });
        }
    });

    // 14. Animate all section-headers on all pages (not just homepage)
    document.querySelectorAll('.section-header').forEach(header => {
        if (!header.classList.contains('visible')) {
            revealObserver.observe(header);
        }
    });

    // 15. Footer entrance on all pages
    document.querySelectorAll('.footer').forEach(footer => {
        if (!footer.classList.contains('visible')) {
            const footerObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        footerObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.05 });
            footerObs.observe(footer);
        }
    });

    // 16. Auto-detect content blocks and add scroll reveals
    document.querySelectorAll('.options-cta, .visit-info, .contact-grid, .location-panels, .mobile-unit-intro').forEach(el => {
        el.classList.add('scroll-reveal');
        revealObserver.observe(el);
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCornerstoneEffects);
} else {
    initCornerstoneEffects();
}

// ===================================
// Analytics Events (Umami)
// ===================================
// Safe no-op when the analytics script is blocked or hasn't loaded.
function trackEvent(name, data) {
    if (typeof umami !== 'undefined' && umami.track) umami.track(name, data);
}

function initAnalyticsEvents() {
    document.addEventListener('click', function(e) {
        const el = e.target.closest('a, button');
        if (!el) return;
        const href = el.getAttribute('href') || '';

        if (href.startsWith('tel:')) {
            trackEvent('call-click', { number: href.slice(4) });
        } else if (href.startsWith('sms:')) {
            trackEvent('text-click');
        } else if (href.includes('appointment.html') || el.id === 'scheduleBtn' || el.id === 'heroScheduleBtn' || el.classList.contains('schedule-trigger')) {
            trackEvent('schedule-click');
        } else if (el.id === 'chatToggle') {
            trackEvent('chat-open');
        } else if (el.classList.contains('lang-btn')) {
            trackEvent('language-switch', { lang: el.dataset.lang });
        }
    });
}
