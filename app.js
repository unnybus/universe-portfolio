// ============================
// UNNYBUS Portfolio — Interactions
// ============================

(function () {
    'use strict';

    // --- Loading Screen ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('loader').classList.add('hidden');
        }, 1400);
    });

    // --- Particle Canvas ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction
                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        this.x -= dx * 0.01;
                        this.y -= dy * 0.01;
                    }
                }

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96, 165, 250, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        canvas.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    // --- Navigation Scroll Effect ---
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
        const scrollY = window.scrollY;

        // Nav background
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Active nav link
        let currentSection = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (scrollY >= top) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        // Scroll to top button
        const scrollTop = document.getElementById('scroll-top');
        if (scrollY > 600) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Scroll to top
    document.getElementById('scroll-top').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Mobile Menu ---
    const navToggle = document.getElementById('nav-toggle');
    const navLinksEl = document.getElementById('nav-links');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksEl.classList.toggle('open');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksEl.classList.remove('open');
        });
    });

    // --- Scroll Reveal (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const suffix = el.textContent.replace(/[0-9]/g, '');
                animateCounter(el, 0, target, 1500, suffix);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el, start, end, duration, suffix) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            el.textContent = current + (suffix || '+');
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = end + '+';
            }
        }
        requestAnimationFrame(update);
    }

    // --- Portfolio Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                if (filter === 'all' || categories.includes(filter)) {
                    item.classList.remove('hidden');
                    // Re-trigger animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // nav height
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Mobile Fixed Bottom CTA Bar (all pages) ---
    if (window.innerWidth <= 768) {
        const bottomBar = document.createElement('div');
        bottomBar.className = 'mobile-bottom-cta';
        bottomBar.innerHTML = `
            <a href="diagnosis.html" class="mobile-cta-btn primary">무료 진단하기</a>
            <a href="http://pf.kakao.com/_VfxaZX/chat" target="_blank" class="mobile-cta-btn outline">문의하기</a>
        `;
        document.body.appendChild(bottomBar);

        // Add body padding so content isn't hidden behind bar
        document.body.style.paddingBottom = '72px';
    }

    // --- Global Pricing Config Injector ---
    // Looks for elements with data-price-key attribute and replaces their text with the config value
    // e.g., <span data-price-key="packages.allinone.light"></span> -> "₩200만~"
    if (typeof UNNYBUS_PRICING !== 'undefined' && typeof formatPriceKorean !== 'undefined') {
        document.querySelectorAll('[data-price-key]').forEach(el => {
            const keyPath = el.getAttribute('data-price-key');
            let value = UNNYBUS_PRICING;
            const keys = keyPath.split('.');
            for (const key of keys) {
                if (value[key] !== undefined) {
                    value = value[key];
                } else {
                    value = undefined;
                    break;
                }
            }

            if (value !== undefined) {
                // If it's a number, format it as price. If string (like ▼80%), use as is.
                if (typeof value === 'number') {
                    // Check for custom prefix/suffix
                    const prefix = el.getAttribute('data-price-prefix') || '₩';
                    const suffix = el.getAttribute('data-price-suffix') || '';
                    el.innerHTML = `${prefix}${formatPriceKorean(value)}${suffix}`;
                } else {
                    el.innerHTML = value;
                }
            }
        });
    }

    // --- "준비중" (Coming Soon) Toast for Unready Projects ---
    function showPreparingToast() {
        // Remove existing toast if any
        const existingToast = document.querySelector('.preparing-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'preparing-toast';
        toast.innerHTML = `
            <div class="preparing-toast-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                </svg>
            </div>
            <div class="preparing-toast-text">
                <strong>준비중입니다</strong>
                <span>해당 프로젝트 페이지는 곧 업데이트됩니다.</span>
            </div>
        `;
        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto-remove after 2.5s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    }

    // Attach click handler to all preparing items
    document.querySelectorAll('[data-preparing="true"]').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            showPreparingToast();
        });
        // Add visual indicator (subtle opacity)
        item.style.cursor = 'pointer';
    });

    // --- Inject Preparing Toast Styles ---
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        .preparing-toast {
            position: fixed;
            top: 32px;
            left: 50%;
            transform: translateX(-50%) translateY(-120%);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 16px 28px;
            background: rgba(20, 20, 35, 0.92);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(96, 165, 250, 0.3);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
            opacity: 0;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
            pointer-events: none;
            white-space: nowrap;
        }
        .preparing-toast.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        .preparing-toast-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.15));
            color: #60a5fa;
            flex-shrink: 0;
        }
        .preparing-toast-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .preparing-toast-text strong {
            color: #fff;
            font-size: 15px;
            font-weight: 600;
            letter-spacing: -0.01em;
        }
        .preparing-toast-text span {
            color: rgba(255, 255, 255, 0.55);
            font-size: 13px;
            font-weight: 400;
        }
        @media (max-width: 480px) {
            .preparing-toast {
                top: 20px;
                padding: 14px 20px;
                gap: 12px;
                border-radius: 14px;
                max-width: calc(100vw - 32px);
                white-space: normal;
            }
            .preparing-toast-icon {
                width: 36px;
                height: 36px;
                border-radius: 10px;
            }
            .preparing-toast-icon svg {
                width: 18px;
                height: 18px;
            }
            .preparing-toast-text strong {
                font-size: 14px;
            }
            .preparing-toast-text span {
                font-size: 12px;
            }
        }
    `;
    document.head.appendChild(toastStyles);

})();
