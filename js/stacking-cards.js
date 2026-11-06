/**
 * Ring Pop Signature Stacking Sections & Icon Parallax
 * Authentic Manufactur Award-Winning Architecture
 * High-performance CSS sticky stacking with GSAP micro-interactions
 */

let mfrStackingTriggers = [];

class MFRStackingSection {
  constructor() {
    this.mainSelector = "#mainContent";
    this.sectionSelector = ".as-stacking-section";
    this.stackedShadowClass = "as-stacking-section--shadow";
    this.updateHeaderHeight();
    this.teardown();
    this.init();
  }

  updateHeaderHeight() {
    const header = document.querySelector(".site-header, header.header, header");
    const h = header ? header.offsetHeight : 70;
    document.documentElement.style.setProperty("--header-height", `${h}px`);
    return h;
  }

  getHeaderHeight() {
    return this.updateHeaderHeight();
  }

  teardown() {
    if (mfrStackingTriggers && mfrStackingTriggers.length) {
      mfrStackingTriggers.forEach(trigger => {
        if (trigger && typeof trigger.kill === "function") {
          trigger.kill();
        }
      });
    }
    mfrStackingTriggers = [];

    const sections = document.querySelectorAll(this.sectionSelector);
    sections.forEach(sec => {
      sec.classList.remove(this.stackedShadowClass);
      const inner = sec.querySelector(".stack-section-inner");
      if (inner && window.gsap) {
        window.gsap.set(inner, { clearProps: "all" });
      }
      sec.querySelectorAll("[data-stacking-section-icon-parallax]").forEach(icon => {
        if (window.gsap) {
          window.gsap.set(icon, { clearProps: "transform" });
        }
      });
    });
  }

  init() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("GSAP / ScrollTrigger not loaded. Stacking sections running in pure CSS mode.");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const sections = Array.from(document.querySelectorAll(this.sectionSelector));
    if (sections.length < 2) return;

    this.updateHeaderHeight();

    // 1. Subtle 3D Card Recession Depth:
    // As the incoming section scrolls over the pinned section, the pinned section's inner
    // content softly scales down to 0.94, dims slightly, and recedes into the background
    sections.slice(0, -1).forEach((section, idx) => {
      const nextSection = sections[idx + 1];
      const inner = section.querySelector(".stack-section-inner");
      if (inner && nextSection) {
        const recessionTween = gsap.to(inner, {
          scale: 0.94,
          opacity: 0.7,
          filter: "brightness(0.85)",
          ease: "none",
          scrollTrigger: {
            trigger: nextSection,
            start: "top bottom",
            end: () => `top top+=${this.getHeaderHeight()}`,
            scrub: true,
            invalidateOnRefresh: true
          }
        });
        if (recessionTween.scrollTrigger) {
          mfrStackingTriggers.push(recessionTween.scrollTrigger);
        }
      }
    });

    // 2. Smooth floating parallax scrub on the central product candy icons
    this.initIconParallax(sections);
  }

  initIconParallax(sections) {
    sections.forEach((section, idx) => {
      const icons = section.querySelectorAll("[data-stacking-section-icon-parallax]");
      if (!icons.length) return;

      const nextSection = sections[idx + 1];
      const hasNext = Boolean(nextSection);

      icons.forEach(icon => {
        const parallaxTween = gsap.fromTo(icon,
          { yPercent: 12 },
          {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: hasNext ? () => `top top+=${this.getHeaderHeight()}` : "bottom top",
              scrub: 1,
              invalidateOnRefresh: true
            }
          }
        );
        if (parallaxTween.scrollTrigger) {
          mfrStackingTriggers.push(parallaxTween.scrollTrigger);
        }
      });
    });
  }
}

function initStackingCards() {
  new MFRStackingSection();

  // Refresh ScrollTrigger calculations once all assets & fonts have finished layout
  setTimeout(() => {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  }, 450);

  window.addEventListener("load", () => {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  });

  // Observe site-header resizing
  const header = document.querySelector(".site-header, header");
  if (header && window.ResizeObserver) {
    let resizeTimer;
    new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const inst = new MFRStackingSection();
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      }, 250);
    }).observe(header);
  }
}
