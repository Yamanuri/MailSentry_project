// main.js

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initGallery();
    initSubscriptionToggle();
    initAddToCartLogic();
    initStatsCountUp();
    initAccordion();
    initScrollReveal();
});


// header scroll shadow
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;


    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}


// mobile nav
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('mobile-nav-overlay');
    const closeBtn = document.getElementById('mobile-nav-close');

    if (!hamburger || !mobileNav) return;

    function openNav() {
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (mobileNav.classList.contains('active')) {
            closeNav();
        } else {
            openNav();
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    if (overlay) overlay.addEventListener('click', closeNav);

    // close nav when links are tapped
    const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');
    mobileLinks.forEach(link => link.addEventListener('click', closeNav));
}


// product gallery (arrows, dots, thumbs)
function initGallery() {
    const mainImg = document.getElementById('gallery-main-img');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const dotsContainer = document.getElementById('gallery-dots');
    const thumbsContainer = document.getElementById('gallery-thumbs');

    if (!mainImg || !thumbsContainer) return;

    const thumbs = thumbsContainer.querySelectorAll('.gallery__thumb');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.gallery__dot') : [];

    // grab all image srcs from thumbnails
    const images = [];
    thumbs.forEach(thumb => {
        const img = thumb.querySelector('img');
        if (img) images.push(img.src);
    });

    let currentIndex = 0;

    function goToSlide(index) {
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;

        // fade out then swap
        mainImg.classList.add('fade-out');
        setTimeout(() => {
            mainImg.src = images[index];
            mainImg.classList.remove('fade-out');
        }, 200);

        currentIndex = index;
        updateActiveStates();
    }

    function updateActiveStates() {
        // sync thumbnail highlight
        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentIndex);
        });

        // sync dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex % dots.length);
        });
    }


    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));


    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            goToSlide(index);
        });
    });


    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.dataset.index);
            goToSlide(index);
        });
    });

    // arrow keys when product section is visible
    document.addEventListener('keydown', (e) => {
        const productSection = document.getElementById('product');
        if (!productSection) return;
        const rect = productSection.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
            if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
        }
    });
}


// subscription expand/collapse
function initSubscriptionToggle() {
    const singleSub = document.getElementById('single-sub');
    const doubleSub = document.getElementById('double-sub');
    const singleHeader = document.getElementById('single-sub-header');
    const doubleHeader = document.getElementById('double-sub-header');
    const singleBody = document.getElementById('single-sub-body');
    const doubleBody = document.getElementById('double-sub-body');
    const singleRadio = document.getElementById('sub-single');
    const doubleRadio = document.getElementById('sub-double');

    if (!singleSub || !doubleSub) return;

    function selectSubscription(type) {
        if (type === 'single') {
            singleRadio.checked = true;
            singleSub.classList.remove('subscription--collapsed');
            doubleSub.classList.add('subscription--collapsed');
            singleBody.style.display = '';
            doubleBody.style.display = 'none';
        } else {
            doubleRadio.checked = true;
            doubleSub.classList.remove('subscription--collapsed');
            singleSub.classList.add('subscription--collapsed');
            doubleBody.style.display = '';
            singleBody.style.display = 'none';
        }
        updateAddToCartLink();
    }

    singleHeader.addEventListener('click', () => selectSubscription('single'));
    doubleHeader.addEventListener('click', () => selectSubscription('double'));


    singleRadio.addEventListener('change', () => selectSubscription('single'));
    doubleRadio.addEventListener('change', () => selectSubscription('double'));
}


// dynamic cart link based on selection
function initAddToCartLogic() {
    // listen for any radio change
    const allFragranceInputs = document.querySelectorAll(
        'input[name="fragrance"], input[name="fragrance-d1"], input[name="fragrance-d2"]'
    );

    allFragranceInputs.forEach(input => {
        input.addEventListener('change', updateAddToCartLink);
    });


    const subInputs = document.querySelectorAll('input[name="subscription"]');
    subInputs.forEach(input => {
        input.addEventListener('change', updateAddToCartLink);
    });


    updateAddToCartLink();
}

function updateAddToCartLink() {
    const addToCartBtn = document.getElementById('add-to-cart');
    if (!addToCartBtn) return;

    // figure out current selection
    const subscriptionType = document.querySelector('input[name="subscription"]:checked');
    const subValue = subscriptionType ? subscriptionType.value : 'single';

    let fragrance = 'original';

    if (subValue === 'single') {

        const selectedFragrance = document.querySelector('input[name="fragrance"]:checked');
        fragrance = selectedFragrance ? selectedFragrance.value : 'original';
    } else {

        const frag1 = document.querySelector('input[name="fragrance-d1"]:checked');
        const frag2 = document.querySelector('input[name="fragrance-d2"]:checked');
        const f1 = frag1 ? frag1.value : 'original';
        const f2 = frag2 ? frag2.value : 'original';
        fragrance = `${f1}-${f2}`;
    }

    // dummy cart URLs - swap these out when the real store is ready
    const cartUrls = {
        'single-original':     'https://gtgperfumes.com/cart/single-original',
        'single-lily': 'https://gtgperfumes.com/cart/single-lily',
        'single-rose': 'https://gtgperfumes.com/cart/single-rose',

        'double-original-original': 'https://gtgperfumes.com/cart/double-original-original',
        'double-original-lily': 'https://gtgperfumes.com/cart/double-original-lily',
        'double-original-rose': 'https://gtgperfumes.com/cart/double-original-rose',
        'double-lily-original': 'https://gtgperfumes.com/cart/double-lily-original',
        'double-lily-lily': 'https://gtgperfumes.com/cart/double-lily-lily',
        'double-lily-rose': 'https://gtgperfumes.com/cart/double-lily-rose',
        'double-rose-original': 'https://gtgperfumes.com/cart/double-rose-original',
        'double-rose-lily': 'https://gtgperfumes.com/cart/double-rose-lily',
        'double-rose-rose': 'https://gtgperfumes.com/cart/double-rose-rose',
    };

    const key = `${subValue}-${fragrance}`;
    const url = cartUrls[key] || `https://gtgperfumes.com/cart/${key}`;

    addToCartBtn.href = url;
}


// count up animation for the stats section
function initStatsCountUp() {
    const statValues = document.querySelectorAll('.stat-item__value');
    if (statValues.length === 0) return;

    let hasAnimated = false;

    function animateCountUp() {
        statValues.forEach(el => {
            const target = parseInt(el.dataset.target);
            if (isNaN(target)) return;

            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // ease out
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(easeOut * target);

                el.textContent = currentValue + '%';

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target + '%';
                }
            }

            requestAnimationFrame(update);
        });
    }

    // trigger when user scrolls to section
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCountUp();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    observer.observe(statsSection);
}


// accordion
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-item__header');
        if (!header) return;

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // close others first
            accordionItems.forEach(other => {
                other.classList.remove('active');
                const otherHeader = other.querySelector('.accordion-item__header');
                if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
            });


            if (!isActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });
}


// reveal sections when scrolled into view
function initScrollReveal() {

    const revealElements = document.querySelectorAll(
        '.product, .collection, .comparison'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}
