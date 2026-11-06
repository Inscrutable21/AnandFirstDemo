/**
 * Master Main Script
 * Orchestrates all modular section scripts
 */

function initStickersParallax() {
  const section = document.getElementById("promoSection");
  if (!section || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const items = section.querySelectorAll("[data-sticker-speed]");
  items.forEach(item => {
    const speed = parseFloat(item.dataset.stickerSpeed) || -5;
    gsap.fromTo(item, 
      { y: speed * 6 },
      {
        y: -speed * 6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  });
}

function initExploreHandsAnimation() {
  const section = document.getElementById("aboutSection");
  if (!section || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const leftHand = section.querySelector(".hand-left");
  const rightHand = section.querySelector(".hand-right");

  if (leftHand) {
    gsap.fromTo(leftHand, 
      { x: -80, opacity: 0.2 },
      {
        x: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 40%",
          scrub: 0.6
        }
      }
    );
  }

  if (rightHand) {
    gsap.fromTo(rightHand, 
      { x: 80, opacity: 0.2 },
      {
        x: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 40%",
          scrub: 0.6
        }
      }
    );
  }
}

function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length <= 1) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const header = document.querySelector('.site-header, header');
        const headerOffset = header ? header.offsetHeight : 0;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSmoothAnchorScroll();
  if (typeof initAnnouncementBar === "function") initAnnouncementBar();
  if (typeof initHeaderNavigation === "function") initHeaderNavigation();
  if (typeof initHeroCarousel === "function") initHeroCarousel();
  if (typeof initShoppingCart === "function") initShoppingCart();
  if (typeof initQuickViewModal === "function") initQuickViewModal();
  if (typeof initLiveSearch === "function") initLiveSearch();
  if (typeof initStackingCards === "function") initStackingCards();
  if (typeof initUgcSlider === "function") initUgcSlider();
  initStickersParallax();
  initExploreHandsAnimation();
  if (typeof initPhysicsCandies === "function") initPhysicsCandies();
  if (typeof initBackToTop === "function") initBackToTop();
});
