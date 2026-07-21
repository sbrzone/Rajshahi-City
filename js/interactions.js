/**
 * Rajshahi District Website - Interactions JavaScript
 * Features: Tabs, accordions, tooltips, and other UI interactions
 */

(function() {
    'use strict';

    // ===============================
    // Tab System
    // ===============================
    const tabContainers = document.querySelectorAll('.institution-tabs');

    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-btn');
        const tabContents = container.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                // Remove active from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active to clicked button and corresponding content
                button.classList.add('active');
                const targetContent = container.querySelector(`#${targetTab}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                // Animate the content items
                if (targetContent) {
                    const items = targetContent.querySelectorAll('.institution-item');
                    items.forEach((item, index) => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            item.style.transition = 'all 0.3s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 60);
                    });
                }
            });
        });
    });

    // ===============================
    // Copy to Clipboard for Info Items
    // ===============================
    const infoItems = document.querySelectorAll('.info-item');

    infoItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.setAttribute('title', 'ক্লিক করলে কপি হবে');

        item.addEventListener('click', () => {
            const valueEl = item.querySelector('.info-value');
            if (valueEl) {
                const text = valueEl.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    // Show toast notification
                    showToast('কপি হয়েছে: ' + text);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            }
        });
    });

    // ===============================
    // Toast Notification System
    // ===============================
    function showToast(message, duration = 3000) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        // Add styles
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: var(--primary);
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.95rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            opacity: 0;
            transition: all 0.3s ease;
            font-family: var(--font-bengali);
        `;

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // ===============================
    // Ripple Effect for Buttons
    // ===============================
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple-effect');

        // Add ripple styles if not already added
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                .ripple-effect {
                    position: absolute;
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    background-color: rgba(255, 255, 255, 0.3);
                    pointer-events: none;
                }
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        const existingRipple = button.querySelector('.ripple-effect');
        if (existingRipple) existingRipple.remove();

        button.appendChild(circle);

        setTimeout(() => circle.remove(), 600);
    }

    const buttons = document.querySelectorAll('.btn, .tab-btn, .upazila-link');
    buttons.forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.addEventListener('click', createRipple);
    });

    // ===============================
    // Hero Typing Effect (optional enhancement)
    // ===============================
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const originalText = heroSubtitle.textContent;
        const texts = [
            originalText,
            'শিক্ষা ও সংস্কৃতির কেন্দ্র',
            'প্রাচীন বাংলার ঐতিহ্য',
            'পদ্মার তীরে সুন্দর শহর'
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                heroSubtitle.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                heroSubtitle.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500; // Pause before typing
            }

            setTimeout(typeEffect, typingSpeed);
        }

        // Start typing effect after initial load
        setTimeout(typeEffect, 3000);
    }

    // ===============================
    // Smooth Scroll Polyfill for Safari
    // ===============================
    if (!('scrollBehavior' in document.documentElement.style)) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
        document.head.appendChild(script);
    }

    // ===============================
    // Performance: Preload Critical Resources
    // ===============================
    function preloadResource(href, as, type) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        if (type) link.type = type;
        document.head.appendChild(link);
    }

    // Preload hero image
    preloadResource('https://i.postimg.cc/LXVpSpdK/1764781022744-2.jpg', 'image');

    // ===============================
    // Service Worker Registration (for PWA capabilities)
    // ===============================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Note: Service worker file would need to be created separately
            // navigator.serviceWorker.register('/sw.js').catch(err => {
            //     console.log('SW registration failed:', err);
            // });
        });
    }

    // ===============================
    // Analytics-like: Track Section Views
    // ===============================
    const viewedSections = new Set();

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    if (sectionId && !viewedSections.has(sectionId)) {
                        viewedSections.add(sectionId);
                        // Could send analytics event here
                        // console.log('Section viewed:', sectionId);
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('section[id]').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // ===============================
    // Dynamic Year in Footer
    // ===============================
    const yearElement = document.querySelector('.footer-year');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = `\u00a9 ${currentYear} রাজশাহী জেলা`;
    }

    // ===============================
    // Reading Progress for Article
    // ===============================
    const articleContainer = document.querySelector('.article-container');
    if (articleContainer) {
        const articleProgress = document.createElement('div');
        articleProgress.className = 'article-progress';
        articleProgress.style.cssText = `
            position: fixed;
            top: 70px;
            left: 0;
            width: 0%;
            height: 2px;
            background: linear-gradient(90deg, var(--accent), var(--primary));
            z-index: 999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(articleProgress);

        window.addEventListener('scroll', () => {
            const rect = articleContainer.getBoundingClientRect();
            const articleTop = rect.top + window.scrollY;
            const articleHeight = rect.height;
            const scrollPos = window.scrollY - articleTop + window.innerHeight / 2;
            const progress = Math.max(0, Math.min(100, (scrollPos / articleHeight) * 100));
            articleProgress.style.width = progress + '%';
        });
    }

    // ===============================
    // Keyboard Navigation Enhancement
    // ===============================
    document.addEventListener('keydown', (e) => {
        // Arrow key navigation between sections
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const sections = Array.from(document.querySelectorAll('section[id]'));
            const currentSection = sections.find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom > 100;
            });

            if (currentSection) {
                const currentIndex = sections.indexOf(currentSection);
                let nextIndex;

                if (e.key === 'ArrowDown') {
                    nextIndex = Math.min(currentIndex + 1, sections.length - 1);
                } else {
                    nextIndex = Math.max(currentIndex - 1, 0);
                }

                if (nextIndex !== currentIndex) {
                    e.preventDefault();
                    sections[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    });

    console.log('\u2705 Rajshahi District Website - Interactions JS Loaded');
})();
