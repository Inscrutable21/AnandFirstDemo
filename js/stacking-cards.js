/**
 * Ring Pop Signature Stacking Sections & Icon Parallax
 * Authentic Manufactur Award-Winning Architecture
 */

let mfrStackingTriggers = [];

class MFRStackingSection {
  constructor() {
    this.mainSelector = "#mainContent";
    this.sectionSelector = ".as-stacking-section";
    this.stackedShadowClass = "as-stacking-section--shadow";
    this.teardown();
    this.init();
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
      sec.style.zIndex = "";
      sec.classList.remove(this.stackedShadowClass);
      sec.querySelectorAll("[data-stacking-section-icon-parallax]").forEach(icon => {
        if (window.gsap) {
          window.gsap.set(icon, { clearProps: "transform" });
        }
      });
    });
  }

  init() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("GSAP / ScrollTrigger not loaded. Stacking sections running in CSS mode.");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const sections = Array.from(document.querySelectorAll(this.sectionSelector));
    if (sections.length < 2) return;

    // 1. Assign incremental z-index so subsequent sections smoothly slide over previous ones
    sections.forEach((section, index) => {
      section.style.zIndex = index + 1;
    });

    // 2. Pin all sections except the last one
    sections.slice(0, -1).forEach(section => {
      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: () => this.getPinStart(section),
        end: () => `+=${this.getStackDistance(section, sections)}`,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true
      });
      mfrStackingTriggers.push(pinTrigger);
    });

    // 3. Toggle elevated shadow as each section scrolls up into place
    sections.slice(1).forEach(section => {
      const shadowTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: () => this.getPinStart(section),
        toggleClass: { targets: section, className: this.stackedShadowClass }
      });
      mfrStackingTriggers.push(shadowTrigger);
    });

    // 4. Smooth Parallax scrub on the central product candy icon
    this.initIconParallax(sections);
  }

  getHeaderHeight() {
    const header = document.querySelector(".site-header, header.header, header");
    return header ? header.offsetHeight : 0;
  }

  isTallerThanViewport(el) {
    return el.getBoundingClientRect().height > window.innerHeight;
  }

  getPinStart(el) {
    return this.isTallerThanViewport(el) ? "bottom bottom" : `top top+=${this.getHeaderHeight()}`;
  }

  getStackDistance(section, allSections) {
    const lastSection = allSections[allSections.length - 1];
    const lastBottom = lastSection.getBoundingClientRect().bottom;
    const currentBottom = section.getBoundingClientRect().bottom;
    return Math.max(lastBottom - currentBottom, 0);
  }

  initIconParallax(sections) {
    sections.forEach((section, idx) => {
      const icons = section.querySelectorAll("[data-stacking-section-icon-parallax]");
      if (!icons.length) return;

      const nextSection = sections[idx + 1];
      const hasNext = Boolean(nextSection);

      const parallaxTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        endTrigger: hasNext ? nextSection : section,
        end: () => (hasNext ? this.getPinStart(nextSection) : "bottom top"),
        scrub: 0.6,
        onUpdate: self => {
          // Floating parallax translation from +25% down to -25%
          const yOffset = 25 - 50 * self.progress;
          icons.forEach(icon => {
            gsap.set(icon, { yPercent: yOffset });
          });
        }
      });
      mfrStackingTriggers.push(parallaxTrigger);
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
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      }, 300);
    }).observe(header);
  }
}
