/* ==========================================================================
   1. ANNOUNCEMENT BAR & HEADER
   ========================================================================== */
function initAnnouncementBar() {
  const bar = document.getElementById("announcementBar");
  const closeBtn = document.getElementById("closeAnnouncement");
  if (!bar || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    bar.classList.add("hidden");
  });
}

function initHeaderNavigation() {
  const header = document.getElementById("siteHeader");
  const productsNavItem = document.getElementById("productsNavItem");
  const mobileMenuTrigger = document.getElementById("mobileMenuTrigger");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const closeMobileDrawer = document.getElementById("closeMobileDrawer");
  const mobileDrawerOverlay = document.getElementById("mobileDrawerOverlay");

  // Sticky header class toggle on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }, { passive: true });

  // Mega Menu Hover / Click toggle with Candy Drop Animation
  if (productsNavItem) {
    let timeout;
    const openMenu = () => {
      clearTimeout(timeout);
      const wasOpen = header.classList.contains("mega-open");
      header.classList.add("mega-open");
      productsNavItem.classList.add("active");
      if (!wasOpen && typeof window.triggerMegaMenuDrop === "function") {
        setTimeout(window.triggerMegaMenuDrop, 150);
      }
    };
    const closeMenu = () => {
      timeout = setTimeout(() => {
        header.classList.remove("mega-open");
        productsNavItem.classList.remove("active");
      }, 250);
    };

    productsNavItem.addEventListener("mouseenter", openMenu);
    productsNavItem.addEventListener("mouseleave", closeMenu);

    const productsBtn = document.getElementById("productsMenuBtn");
    if (productsBtn) {
      productsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (header.classList.contains("mega-open")) {
          header.classList.remove("mega-open");
          productsNavItem.classList.remove("active");
        } else {
          openMenu();
        }
      });
    }

    const megaMenu = document.getElementById("megaMenu");
    if (megaMenu) {
      megaMenu.addEventListener("mouseenter", openMenu);
      megaMenu.addEventListener("mouseleave", closeMenu);

      megaMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          header.classList.remove("mega-open");
          productsNavItem.classList.remove("active");
        });
      });
    }

    document.addEventListener("click", (e) => {
      if (!header.contains(e.target)) {
        header.classList.remove("mega-open");
        productsNavItem.classList.remove("active");
      }
    });
  }

  // Mobile Drawer Toggle
  const openMobileMenu = () => mobileDrawer.classList.add("active");
  const closeMobileMenu = () => mobileDrawer.classList.remove("active");

  if (mobileMenuTrigger) mobileMenuTrigger.addEventListener("click", openMobileMenu);
  if (closeMobileDrawer) closeMobileDrawer.addEventListener("click", closeMobileMenu);
  if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener("click", closeMobileMenu);

  // Close mobile drawer when any link is clicked
  const mobileLinks = mobileDrawer.querySelectorAll("a");
  mobileLinks.forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });
}
