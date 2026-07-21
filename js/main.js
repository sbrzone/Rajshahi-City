/**
 * Rajshahi District Website - Main JavaScript
 * Features: Dark mode, scroll progress, navigation, loader, back to top
 */

(function() {
    'use strict';

    // ===============================
    // DOM Elements
    // ===============================
    const loader = document.getElementById('loader');
    const scrollProgress = document.getElementById('scrollProgress');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('menuToggle');
    const themeToggle = document.getElementById('themeToggle');
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const backToTop = document.getElementById('backToTop');
    const upazilaToggle = document.getElementById('upazilaToggle');
    const upazilaList = document.getElementById('upazilaList');

    // ===============================
    // Loader
    // ===============================
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) {
                loader.classList.add('hidden');
            }
        }, 800);
    });

    // ===============================
    // Scroll Progress Bar
    // ===============================
    function updateScrollProgress() {
        if (!scrollProgress) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }

    // ===============================
    // Navigation Scroll Effect
    // ===============================
    function handleNavScroll() {
        if (!mainNav) return;
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    }

    // ===============================
    // Active Nav Link on Scroll
    // ===============================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinkEls = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinkEls.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // ===============================
    // Mobile Menu Toggle
    // ===============================
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ===============================
    // Upazila Menu Toggle
    // ===============================
    if (upazilaToggle && upazilaList) {
        upazilaToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            upazilaToggle.classList.toggle('active');
            upazilaList.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!upazilaList.contains(e.target) && !upazilaToggle.contains(e.target)) {
                upazilaToggle.classList.remove('active');
                upazilaList.classList.remove('active');
            }
        });
    }

    // ===============================
    // Dark Mode Toggle
    // ===============================
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon(true);
        }
    }

    function updateThemeIcon(isDark) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                updateThemeIcon(false);
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                updateThemeIcon(true);
            }
        });
    }

    initTheme();

    // ===============================
    // Search Functionality
    // ===============================
    const searchableContent = [];

    function buildSearchIndex() {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            const title = section.querySelector('h2, h3');
            const paragraphs = section.querySelectorAll('p');
            const text = Array.from(paragraphs).map(p => p.textContent).join(' ');

            if (title) {
                searchableContent.push({
                    title: title.textContent,
                    text: text.substring(0, 200) + '...',
                    id: section.id,
                    element: section
                });
            }
        });
    }

    function performSearch(query) {
        if (!query.trim()) {
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = searchableContent.filter(item => 
            item.title.toLowerCase().includes(lowerQuery) ||
            item.text.toLowerCase().includes(lowerQuery)
        );

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">কোনো ফলাফল পাওয়া যায়নি</div>';
        } else {
            searchResults.innerHTML = results.map(item => `
                <div class="search-result-item" data-target="${item.id}">
                    <h4>${highlightMatch(item.title, query)}</h4>
                    <p>${highlightMatch(item.text, query)}</p>
                </div>
            `).join('');

            // Add click handlers
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const targetId = item.getAttribute('data-target');
                    const target = document.getElementById(targetId);
                    if (target) {
                        closeSearch();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        target.classList.add('highlight-section');
                        setTimeout(() => target.classList.remove('highlight-section'), 2000);
                    }
                });
            });
        }
        searchResults.classList.add('active');
    }

    function highlightMatch(text, query) {
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function openSearch() {
        if (searchOverlay) {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput?.focus(), 100);
            buildSearchIndex();
        }
    }

    function closeSearch() {
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
            if (searchInput) searchInput.value = '';
            searchResults.classList.remove('active');
        }
    }

    if (searchToggle) searchToggle.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);
    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) closeSearch();
        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', (e) => performSearch(e.target.value));
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSearch();
        });
    }

    // ===============================
    // Back to Top
    // ===============================
    function handleBackToTop() {
        if (!backToTop) return;
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===============================
    // Smooth Scroll for Anchor Links
    // ===============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ===============================
    // Scroll Event Listener
    // ===============================
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollProgress();
                handleNavScroll();
                updateActiveNavLink();
                handleBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ===============================
    // Keyboard Shortcuts
    // ===============================
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchOverlay.classList.contains('active')) {
                closeSearch();
            } else {
                openSearch();
            }
        }
        // Escape to close search
        if (e.key === 'Escape') {
            closeSearch();
        }
    });

    // ===============================
    // Image Lazy Loading with Fade
    // ===============================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('img-loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        lazyImages.forEach(img => {
            img.classList.add('img-loading');
            imageObserver.observe(img);
        });
    }

    // ===============================
    // External Links - Open in New Tab
    // ===============================
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    console.log('\u2705 Rajshahi District Website - Main JS Loaded');
})();
