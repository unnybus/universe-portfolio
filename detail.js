// ============================
// UNNYBUS Portfolio — Detail Page Interactions
// ============================

(function () {
    'use strict';

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    let galleryImages = [];
    let currentIndex = 0;

    // Collect all gallery images
    function initGallery() {
        galleryImages = Array.from(document.querySelectorAll('.gallery-item img, .gallery-full img'));
        galleryImages.forEach((img, idx) => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => openLightbox(idx));
        });
    }

    function openLightbox(idx) {
        currentIndex = idx;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        if (!galleryImages[currentIndex]) return;
        lightboxImg.src = galleryImages[currentIndex].src;
        lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateLightbox();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightbox();
    }

    // Event listeners
    if (lightbox) {
        document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
        document.getElementById('lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
        document.getElementById('lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // Init
    initGallery();

})();

// Top Button Logic
const topBtn = document.createElement('button');
topBtn.className = 'top-btn';
topBtn.innerHTML = '<svg><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
topBtn.title = '맨 위로 가기';
document.body.appendChild(topBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        topBtn.classList.add('visible');
    } else {
        topBtn.classList.remove('visible');
    }
});

topBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
