/**
 * Rajshahi District Website - Animations JavaScript
 * Features: AOS-like scroll animations, number counters, parallax effects
 */

(function() {
    'use strict';

    // ===============================
    // Intersection Observer for Scroll Animations
    // ===============================
    const animatedElements = document.querySelectorAll('[data-aos]');

    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, parseInt(delay));
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => animationObserver.observe(el));
    } else {
        // Fallback for browsers without IntersectionObserver
        animatedElements.forEach(el => el.classList.add('aos-animate'));
    }

    // ===============================
    // Number Counter Animation
    // ===============================
    const counters = document.querySelectorAll('.stat-value[data-count]');

    function animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;

            if (isDecimal) {
                element.textContent = current.toFixed(2);
            } else {
                element.textContent = Math.floor(current).toLocaleString('bn-BD');
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                if (isDecimal) {
                    element.textContent = target.toFixed(2);
                } else {
                    element.textContent = target.toLocaleString('bn-BD');
                }
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    } else {
        counters.forEach(counter => animateCounter(counter));
    }

    // ===============================
    // Parallax Effect for Hero
    // ===============================
    const heroBg = document.querySelector('.hero-bg');

    if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let heroTicking = false;

        window.addEventListener('scroll', () => {
            if (!heroTicking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (scrollY < window.innerHeight) {
                        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
                    }
                    heroTicking = false;
                });
                heroTicking = true;
            }
        });
    }

    // ===============================
    // Reveal on Scroll (for elements without data-aos)
    // ===============================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ===============================
    // Stagger Animation for Lists
    // ===============================
    function staggerAnimate(container, childSelector, delay = 100) {
        const children = container.querySelectorAll(childSelector);
        children.forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = `opacity 0.5s ease ${index * delay}ms, transform 0.5s ease ${index * delay}ms`;

            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, 100);
        });
    }

    // Apply stagger to grids when they come into view
    const staggerContainers = document.querySelectorAll('.admin-grid, .product-grid, .stats-grid, .geo-features');

    if ('IntersectionObserver' in window) {
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    staggerAnimate(entry.target, '> *', 100);
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        staggerContainers.forEach(container => staggerObserver.observe(container));
    }

    // ===============================
    // Magnetic Button Effect
    // ===============================
    const magneticButtons = document.querySelectorAll('.magnetic');

    if (!window.matchMedia('(pointer: coarse)').matches) {
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ===============================
    // Text Scramble Effect for Hero Title
    // ===============================
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];

            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }

            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;

            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];

                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }

            this.el.innerHTML = output;

            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }

        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Apply scramble effect to hero title on load
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const originalText = heroTitle.textContent;
        const scrambler = new TextScramble(heroTitle);

        setTimeout(() => {
            scrambler.setText(originalText);
        }, 500);
    }

    // ===============================
    // Wave Animation for Footer Social Icons
    // ===============================
    const socialIcons = document.querySelectorAll('.footer-social a');

    function waveAnimateIcons() {
        socialIcons.forEach((icon, index) => {
            icon.style.animation = `wave 0.5s ease ${index * 0.1}s`;
        });
    }

    // Trigger wave when footer is visible
    const footer = document.querySelector('.main-footer');
    if (footer && 'IntersectionObserver' in window) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    waveAnimateIcons();
                    footerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        footerObserver.observe(footer);
    }

    // ===============================
    // Card Tilt Effect (3D)
    // ===============================
    const tiltCards = document.querySelectorAll('.admin-card, .product-card, .stat-card');

    if (!window.matchMedia('(pointer: coarse)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    // ===============================
    // Smooth Reveal for Tab Content
    // ===============================
    const tabContents = document.querySelectorAll('.tab-content');

    tabContents.forEach(content => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    const items = mutation.target.querySelectorAll('.institution-item');
                    items.forEach((item, index) => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-20px)';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, index * 80);
                    });
                }
            });
        });

        observer.observe(content, { attributes: true, attributeFilter: ['class'] });
    });

    console.log('\u2705 Rajshahi District Website - Animations JS Loaded');
})();
