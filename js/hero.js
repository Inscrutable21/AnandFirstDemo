/* ==========================================================================
   2. HERO CAROUSEL
   ========================================================================== */
function initHeroCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".carousel-dots .dot");
  const prevBtn = document.getElementById("heroPrevBtn");
  const nextBtn = document.getElementById("heroNextBtn");
  const heroSection = document.getElementById("heroSection");

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayTimer;
  const slideCount = slides.length;

  const goToSlide = (index) => {
    slides[currentIndex].classList.remove("active");
    dots[currentIndex].classList.remove("active");
    currentIndex = (index + slideCount) % slideCount;
    slides[currentIndex].classList.add("active");
    dots[currentIndex].classList.add("active");
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => goToSlide(idx));
  });

  // Autoplay
  const startAutoplay = () => {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 5500);
  };
  const stopAutoplay = () => clearInterval(autoplayTimer);

  startAutoplay();
  if (heroSection) {
    heroSection.addEventListener("mouseenter", stopAutoplay);
    heroSection.addEventListener("mouseleave", startAutoplay);
  }

  // Touch Swipe for mobile
  let startX = 0;
  heroSection.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  heroSection.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });
}
