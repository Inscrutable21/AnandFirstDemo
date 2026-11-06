/**
 * GET INSPIRED Carousel & Interactive Drag / Scroll
 * Authentic Ring Pop Gallery Architecture
 */

function initUgcSlider() {
  const track = document.getElementById("inspiredTrack");
  const prevBtn = document.getElementById("inspiredPrevBtn");
  const nextBtn = document.getElementById("inspiredNextBtn");

  if (!track) return;

  // Arrow Buttons Click Handlers
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const scrollAmount = track.clientWidth * 0.75;
      track.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const scrollAmount = track.clientWidth * 0.75;
      track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  }

  // Update arrow button visibility based on scroll position
  function updateArrowVisibility() {
    if (!prevBtn && !nextBtn) return;
    const maxScrollLeft = track.scrollWidth - track.clientWidth - 10;
    
    if (prevBtn) {
      if (track.scrollLeft > 25) {
        prevBtn.classList.add("visible");
      } else {
        prevBtn.classList.remove("visible");
      }
    }

    if (nextBtn) {
      if (track.scrollLeft >= maxScrollLeft) {
        nextBtn.classList.add("hidden");
      } else {
        nextBtn.classList.remove("hidden");
      }
    }
  }

  track.addEventListener("scroll", updateArrowVisibility, { passive: true });
  updateArrowVisibility();

  // Mouse Drag to Scroll with Velocity
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let hasMoved = false;

  track.addEventListener("mousedown", (e) => {
    isDown = true;
    hasMoved = false;
    startX = e.pageX - track.offsetLeft;
    scrollStart = track.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    if (isDown) {
      isDown = false;
      setTimeout(() => { hasMoved = false; }, 50);
    }
  });

  track.addEventListener("mouseleave", () => {
    isDown = false;
  });

  track.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    hasMoved = true;
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.6;
    track.scrollLeft = scrollStart - walk;
  });

  // Re-check arrows after layout settles
  window.addEventListener("resize", updateArrowVisibility);
  setTimeout(updateArrowVisibility, 350);
}
