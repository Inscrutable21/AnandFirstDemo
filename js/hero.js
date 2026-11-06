/* ==========================================================================
   2. HERO CAROUSEL - AUTOMATIC CONTINUOUS SLIDE
   ========================================================================== */
function initHeroCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  const heroSection = document.getElementById("heroSection");

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const slideCount = slides.length;
  const AUTOPLAY_INTERVAL = 4500; // 4.5 seconds per slide

  const goToSlide = (index) => {
    slides[currentIndex].classList.remove("active");
    currentIndex = (index + slideCount) % slideCount;
    slides[currentIndex].classList.add("active");
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(currentIndex - 1);
  };

  // Continuous Automatic Slide
  const startAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  // Start automatic slide immediately
  startAutoplay();

  // Pause when browser tab is hidden to save resources and resume when focused
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  // Touch swipe support on mobile devices
  if (heroSection) {
    let startX = 0;
    heroSection.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    heroSection.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        startAutoplay(); // Reset timer after manual swipe
      }
    }, { passive: true });
  }
}
