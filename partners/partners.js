// Partners Site JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initImpactStats();
    initFaithToggle();
    initFadeAnimations();
    initContactForm();
    initVolunteerForm();
    initPrayerForm();
    initNewsletterForm();
    initProgressBar();
    initFAQ();
    initFloatingDonate();
    initBackToTop();
    initCampaignBanner();
    initGivingBox();
});


// Legacy Builder giving box: amount + frequency selection (visual only —
// the actual gift is completed on the EasyTithe giving page).
function initGivingBox() {
    document.querySelectorAll('.giving-amounts, .giving-frequency').forEach(function(group) {
        group.addEventListener('click', function(e) {
            var btn = e.target.closest('button');
            if (!btn) return;
            group.querySelectorAll('button').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
        });
    });
}


// Upcoming event / campaign area on the landing page. The HTML holds a
// "coming soon" placeholder; while a campaign window is open, that campaign's
// title, copy, and button replace it. Dates are month/day (inclusive) and
// repeat every year. Edit copy and links here.
function initCampaignBanner() {
    var section = document.getElementById('campaignSection');
    if (!section) return;

    var CAMPAIGNS = [
        {
            title: 'Matching Campaign',
            blurb: 'Every gift given through December 31 is matched, doubling your impact for moms and babies in North Georgia.',
            link: 'give.html',
            linkText: 'Double My Gift',
            start: [11, 1],  // Nov 1
            end: [12, 31]    // Dec 31
        },
        {
            title: 'Annual Gala',
            blurb: 'Join us for an evening celebrating life. Reserve your seat or sponsor a table today.',
            link: 'gala.html',
            linkText: 'Reserve a Seat',
            start: [1, 1],   // Jan 1
            end: [3, 11]     // Mar 11
        }
        // Add the 5K (and any other campaigns) here when dates are set:
        // { title: '5K Run for Life', blurb: '...', link: 'events.html', linkText: 'Register', start: [m, d], end: [m, d] }
    ];

    var now = new Date();
    var today = (now.getMonth() + 1) * 100 + now.getDate();
    var active = CAMPAIGNS.find(function(c) {
        var s = c.start[0] * 100 + c.start[1];
        var e = c.end[0] * 100 + c.end[1];
        return s <= e ? (today >= s && today <= e) : (today >= s || today <= e);
    });
    if (!active) return;

    document.getElementById('campaignTitle').textContent = active.title;
    document.getElementById('campaignBlurb').textContent = active.blurb;
    var link = document.getElementById('campaignLink');
    link.href = active.link;
    link.textContent = active.linkText;
    section.hidden = false;
}


// Mobile Menu
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function() {
        menu.classList.toggle('open');
    });

    menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            menu.classList.remove('open');
        });
    });

    const closeBtn = menu.querySelector('.mobile-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            menu.classList.remove('open');
        });
    }
}

// Smooth Scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var offset = 80;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });
}

// Animated Impact Stats Counter
function initImpactStats() {
    var stats = document.querySelectorAll('[data-target]');
    if (!stats.length) return;

    var animated = false;
    var container = stats[0].closest('.hero-stats') || stats[0].closest('.impact-stats-row');
    if (!container) {
        // Stats visible on load, animate immediately
        animateCounters();
        return;
    }

    function animateCounters() {
        if (animated) return;
        animated = true;
        stats.forEach(function(stat) {
            var target = parseInt(stat.getAttribute('data-target'));
            var suffix = stat.getAttribute('data-suffix') || '';
            var duration = 2000;
            var start = 0;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = Math.floor(eased * target);
                stat.textContent = current.toLocaleString() + suffix;
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    stat.textContent = target.toLocaleString() + suffix;
                }
            }
            requestAnimationFrame(step);
        });
    }

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(container);
}

// Statement of Faith collapsible
function initFaithToggle() {
    var toggle = document.querySelector('.faith-toggle');
    if (!toggle) return;
    var content = document.querySelector('.faith-content');

    toggle.addEventListener('click', function() {
        toggle.classList.toggle('open');
        content.classList.toggle('open');
    });
}

// Fade-in animations on scroll
function initFadeAnimations() {
    var elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(function(el) { observer.observe(el); });
}

// Contact Form
function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(function() {
            btn.textContent = 'Message Sent!';
            btn.style.background = 'var(--secondary)';
            form.reset();
            setTimeout(function() {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 1000);
    });
}

// Progress Bar Animation
function initProgressBar() {
    var fill = document.querySelector('.progress-fill');
    if (!fill) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(fill);
}

// FAQ Accordion
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var item = btn.closest('.faq-item');
            // Close others
            document.querySelectorAll('.faq-item.open').forEach(function(other) {
                if (other !== item) other.classList.remove('open');
            });
            item.classList.toggle('open');
        });
    });
}

// Floating Donate Button - show after scrolling 300px
function initFloatingDonate() {
    var btn = document.querySelector('.floating-donate');
    if (!btn) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
}

// Back to Top Button - show after scrolling 500px
function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Volunteer Form
function initVolunteerForm() {
    var form = document.getElementById('volunteerForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var originalText = btn.textContent;
        btn.textContent = 'Submitting...';
        btn.disabled = true;

        setTimeout(function() {
            btn.textContent = 'Interest Submitted!';
            btn.style.background = 'var(--secondary)';
            form.reset();
            setTimeout(function() {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 1000);
    });
}

// Prayer Form
function initPrayerForm() {
    var form = document.getElementById('prayerForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var originalText = btn.textContent;
        btn.textContent = 'Submitting...';
        btn.disabled = true;

        setTimeout(function() {
            btn.textContent = 'Prayer Request Sent!';
            btn.style.background = 'var(--secondary)';
            form.reset();
            setTimeout(function() {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 1000);
    });
}

// Newsletter Page Form
function initNewsletterForm() {
    var form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var originalText = btn.textContent;
        btn.textContent = 'Subscribing...';
        btn.disabled = true;

        setTimeout(function() {
            btn.textContent = 'Subscribed!';
            btn.style.background = 'var(--secondary)';
            form.reset();
            setTimeout(function() {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 1000);
    });
}
