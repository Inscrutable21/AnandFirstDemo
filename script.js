/**
 * ==========================================================================
 * RING POP® — Candy for Every Celebration
 * Main JavaScript Interactions & Physics Engine
 * Inspired by Manufactur (Awwwards Honorable Mention)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initAnnouncementBar();
  initHeaderNavigation();
  initHeroCarousel();
  initShoppingCart();
  initQuickViewModal();
  initLiveSearch();
  initStackingCards();
  initUgcSlider();
  initPhysicsCandies();
  initBackToTop();
});

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

  // Mega Menu Hover / Click toggle
  if (productsNavItem) {
    let timeout;
    const openMenu = () => {
      clearTimeout(timeout);
      header.classList.add("mega-open");
      productsNavItem.classList.add("active");
    };
    const closeMenu = () => {
      timeout = setTimeout(() => {
        header.classList.remove("mega-open");
        productsNavItem.classList.remove("active");
      }, 200);
    };

    productsNavItem.addEventListener("mouseenter", openMenu);
    productsNavItem.addEventListener("mouseleave", closeMenu);

    const megaMenu = document.getElementById("megaMenu");
    if (megaMenu) {
      megaMenu.addEventListener("mouseenter", openMenu);
      megaMenu.addEventListener("mouseleave", closeMenu);
    }
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

/* ==========================================================================
   3. SHOPPING CART SYSTEM
   ========================================================================== */
const cartState = {
  items: [
    {
      id: "party-pack",
      title: "Ring Pop Party Pack",
      flavor: "Assorted (20ct Bag)",
      price: 14.99,
      qty: 1,
      img: "assets/RingPop_PartyPack.png"
    },
    {
      id: "originals-box",
      title: "Originals Variety Box",
      flavor: "Classic 4-Flavor (24ct)",
      price: 19.99,
      qty: 1,
      img: "assets/RingPop_24ctBoxFRONT.png"
    }
  ],
  discount: 0,
  promoApplied: false,
  freeShippingThreshold: 45.00
};

function initShoppingCart() {
  const cartTrigger = document.getElementById("cartTriggerBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartDrawerOverlay");
  const closeCartBtn = document.getElementById("closeCartDrawer");

  const openCart = () => {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeCart = () => {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (cartTrigger) cartTrigger.addEventListener("click", openCart);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // Expose helpers globally
  window.openCartDrawer = openCart;
  window.closeCartDrawer = closeCart;
  window.updateItemQty = updateItemQty;
  window.removeItemFromCart = removeItemFromCart;
  window.addToCartDirect = addToCartDirect;
  window.applyPromoCode = applyPromoCode;
  window.handleCheckout = handleCheckout;

  renderCart();
}

function renderCart() {
  const itemsContainer = document.getElementById("cartItemsList");
  const countBadge = document.getElementById("cartCountBadge");
  const drawerCount = document.getElementById("cartDrawerCount");
  const subtotalEl = document.getElementById("cartSubtotal");
  const discountRow = document.getElementById("discountRow");
  const discountEl = document.getElementById("cartDiscount");
  const shippingEl = document.getElementById("cartShipping");
  const totalEl = document.getElementById("cartTotal");
  const meterText = document.getElementById("shippingMeterText");
  const meterProgress = document.getElementById("shippingMeterProgress");

  const totalQty = cartState.items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (countBadge) countBadge.textContent = totalQty;
  if (drawerCount) drawerCount.textContent = `${totalQty} item${totalQty === 1 ? '' : 's'}`;

  // Shipping & Discount
  let discountAmount = 0;
  if (cartState.promoApplied) {
    discountAmount = subtotal * 0.20;
    discountRow.style.display = "flex";
    discountEl.textContent = `-$${discountAmount.toFixed(2)}`;
  } else {
    discountRow.style.display = "none";
  }

  const isFreeShipping = subtotal >= cartState.freeShippingThreshold || totalQty === 0;
  const shipping = (isFreeShipping || subtotal === 0) ? 0 : 4.99;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  // Free shipping progress meter
  const remainingForFree = Math.max(0, cartState.freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / cartState.freeShippingThreshold) * 100);

  if (meterProgress) meterProgress.style.width = `${progressPercent}%`;
  if (meterText) {
    if (isFreeShipping) {
      meterText.innerHTML = "<strong>Congratulations!</strong> You unlocked <strong>FREE SHIPPING!</strong>";
    } else {
      meterText.innerHTML = `Add <strong>$${remainingForFree.toFixed(2)}</strong> more for <strong>FREE SHIPPING!</strong>`;
    }
  }

  // Render Item HTML
  if (!itemsContainer) return;
  if (cartState.items.length === 0) {
    itemsContainer.innerHTML = `
      <div style="text-align:center; padding: 3rem 1rem; color: rgba(20,23,35,0.6);">
        
        <h4 style="font-family: var(--font-display); font-size: 1.3rem; margin-bottom: 0.5rem;">Your Sweet Bag is Empty</h4>
        <p style="font-size: 0.9rem;">Explore our colorful drops and add some pop to your day!</p>
      </div>
    `;
    return;
  }

  itemsContainer.innerHTML = cartState.items.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-img">
        <img src="${item.img}" alt="${item.title}">
      </div>
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.title}</h4>
        <span class="cart-item-flavor">${item.flavor}</span>
        <div class="cart-item-bottom">
          <div class="qty-stepper">
            <button class="qty-btn minus" onclick="updateItemQty('${item.id}', -1)">-</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn plus" onclick="updateItemQty('${item.id}', 1)">+</button>
          </div>
          <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
        </div>
      </div>
      <button class="cart-remove-item" onclick="removeItemFromCart('${item.id}')" title="Remove item">&times;</button>
    </div>
  `).join("");
}

function updateItemQty(id, change) {
  const item = cartState.items.find(i => i.id === id);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    removeItemFromCart(id);
    return;
  }
  renderCart();
}

function removeItemFromCart(id) {
  cartState.items = cartState.items.filter(i => i.id !== id);
  renderCart();
  showToast("Item removed from your bag.");
}

function addToCartDirect(title, price, img, flavor = "Assorted Flavor Pack") {
  const existing = cartState.items.find(i => i.title === title && i.flavor === flavor);
  if (existing) {
    existing.qty += 1;
  } else {
    cartState.items.push({
      id: "prod-" + Date.now(),
      title,
      flavor,
      price,
      qty: 1,
      img
    });
  }

  renderCart();
  showToast(`Added ${title} to bag!`);
  fireCandyConfetti();
  window.openCartDrawer();
}

function applyPromoCode() {
  const codeInput = document.getElementById("promoCodeInput");
  if (!codeInput) return;
  const code = codeInput.value.trim().toUpperCase();

  if (code === "BLING20" || code === "RINGPOP") {
    cartState.promoApplied = true;
    renderCart();
    showToast("Code applied! 20% discount unlocked!");
    fireCandyConfetti();
  } else {
    showToast("Invalid code. Try 'BLING20' for 20% off!");
  }
}

function handleCheckout() {
  if (cartState.items.length === 0) {
    showToast("Your bag is empty! Add sweet treats first.");
    return;
  }
  fireCandyConfetti();
  showToast("Redirecting to Bazooka Candy Secure Checkout...");
  setTimeout(() => {
    alert("Thank you for choosing Ring Pop! Replicated checkout simulation complete.");
  }, 1200);
}

/* ==========================================================================
   4. QUICK VIEW MODAL & FLAVOR SELECTOR
   ========================================================================== */
function initQuickViewModal() {
  const overlay = document.getElementById("quickViewOverlay");
  const closeBtn = document.getElementById("closeQuickView");
  const flavorPills = document.querySelectorAll(".flavor-pill");
  const sizePills = document.querySelectorAll(".size-pill");
  const addBtn = document.getElementById("qvAddBtn");

  if (!overlay) return;

  closeBtn.addEventListener("click", () => overlay.classList.remove("active"));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("active");
  });

  flavorPills.forEach(pill => {
    pill.addEventListener("click", () => {
      flavorPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
    });
  });

  sizePills.forEach(pill => {
    pill.addEventListener("click", () => {
      sizePills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
    });
  });

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const title = document.getElementById("qvTitle").textContent;
      const priceText = document.getElementById("qvPrice").textContent.replace("$", "");
      const price = parseFloat(priceText) || 14.99;
      const img = document.getElementById("qvImage").getAttribute("src");
      const activeFlavor = document.querySelector(".flavor-pill.active")?.dataset.flavor || "Strawberry";

      addToCartDirect(title, price, img, `${activeFlavor} Pack`);
      overlay.classList.remove("active");
    });
  }

  window.openQuickView = (title, price, img, desc, badge = "BESTSELLER") => {
    document.getElementById("qvTitle").textContent = title;
    document.getElementById("qvPrice").textContent = price;
    document.getElementById("qvImage").src = img;
    document.getElementById("qvDesc").textContent = desc;
    document.getElementById("qvBadge").textContent = badge;
    overlay.classList.add("active");
  };
}

/* ==========================================================================
   5. LIVE SEARCH MODAL
   ========================================================================== */
const catalogProducts = [
  { title: "Ring Pop Party Pack (20ct)", price: "$14.99", img: "assets/RingPop_PartyPack.png", category: "Bulk", desc: "Assorted party bag" },
  { title: "Originals Variety Box (24ct)", price: "$19.99", img: "assets/RingPop_24ctBoxFRONT.png", category: "Originals", desc: "Classic flavors" },
  { title: "Wedding Bridal Collection Box", price: "$18.99", img: "assets/Frame_659.webp", category: "Wedding", desc: "Diamond clear bling" },
  { title: "Colorfest® Emerald Green Apple (30ct)", price: "$21.99", img: "assets/RingPop_Colorfest1.png", category: "Colorfest", desc: "Monochrome party candy" },
  { title: "Halloween Spooky Special Edition", price: "$24.99", img: "assets/Halloween36ctBoxfront.png", category: "Seasonal", desc: "Trick-or-treat favorites" },
  { title: "Easter Spring Celebration Box", price: "$22.99", img: "assets/easter-36.png", category: "Seasonal", desc: "Pastel Easter candies" }
];

function initLiveSearch() {
  const triggerBtn = document.getElementById("searchTriggerBtn");
  const overlay = document.getElementById("searchModalOverlay");
  const closeBtn = document.getElementById("closeSearchModal");
  const input = document.getElementById("siteSearchInput");
  const resultsContainer = document.getElementById("searchResultsList");

  if (!triggerBtn || !overlay) return;

  const openSearch = () => {
    overlay.classList.add("active");
    input.focus();
  };

  const closeSearch = () => {
    overlay.classList.remove("active");
    input.value = "";
    resultsContainer.innerHTML = "";
  };

  triggerBtn.addEventListener("click", openSearch);
  closeBtn.addEventListener("click", closeSearch);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSearch();
  });

  const doSearch = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) {
      resultsContainer.innerHTML = "";
      return;
    }

    const matches = catalogProducts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="color: rgba(255,255,255,0.7); text-align: center; padding: 2rem;">
          No matching candies found for "${query}". Try searching "Party", "Blue", or "Wedding"!
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.map(p => `
      <div class="search-result-item" onclick="openQuickView('${p.title}', '${p.price}', '${p.img}', '${p.desc}'); document.getElementById('searchModalOverlay').classList.remove('active');">
        <img src="${p.img}" alt="${p.title}">
        <div>
          <span class="result-title">${p.title}</span>
          <p style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">${p.desc}</p>
        </div>
        <span class="result-price">${p.price}</span>
      </div>
    `).join("");
  };

  input.addEventListener("input", (e) => doSearch(e.target.value));

  window.searchFor = (keyword) => {
    input.value = keyword;
    doSearch(keyword);
  };
}

/* ==========================================================================
   6. STACKING CARDS & SCROLL PARALLAX
   ========================================================================== */
function initStackingCards() {
  const cards = document.querySelectorAll(".as-stacking-section");
  if (!cards.length) return;

  // If GSAP and ScrollTrigger are loaded, add buttery smooth scaling and parallax
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    cards.forEach((card, i) => {
      const inner = card.querySelector(".stack-card-inner");
      const floatingPops = card.querySelectorAll(".floating-candypop");

      // Scale down previous card slightly as next card covers it
      if (i < cards.length - 1) {
        ScrollTrigger.create({
          trigger: cards[i + 1],
          start: "top 80%",
          end: "top 100px",
          scrub: true,
          onUpdate: (self) => {
            const scale = 1 - (self.progress * 0.05);
            const brightness = 1 - (self.progress * 0.25);
            gsap.set(inner, {
              scale: scale,
              filter: `brightness(${brightness})`,
              transformOrigin: "center top"
            });
          }
        });
      }

      // Parallax on floating candies
      floatingPops.forEach(pop => {
        const speed = parseFloat(pop.dataset.speed) || 1;
        gsap.to(pop, {
          y: -40 * speed,
          rotation: (i % 2 === 0 ? 15 : -15),
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    });
  }
}

/* ==========================================================================
   7. UGC SLIDER INTERACTIONS
   ========================================================================== */
function initUgcSlider() {
  const track = document.getElementById("ugcTrack");
  if (!track) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.parentElement.scrollLeft;
  });

  track.addEventListener("mouseleave", () => isDown = false);
  track.addEventListener("mouseup", () => isDown = false);

  track.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.parentElement.scrollLeft = scrollLeft - walk;
  });
}

/* ==========================================================================
   8. NEWSLETTER CONFETTI FORM
   ========================================================================== */
window.handleNewsletterSubmit = function(e) {
  e.preventDefault();
  const emailInput = document.getElementById("newsletterEmail");
  const successBox = document.getElementById("newsletterSuccess");
  const form = document.getElementById("newsletterForm");

  if (!emailInput || !emailInput.value) return;

  fireCandyConfetti();
  form.style.display = "none";
  successBox.style.display = "flex";
  showToast("Welcome to the Ring Pop Celebration Crew!");
};

/* ==========================================================================
   9. INTERACTIVE DRAGGABLE PHYSICS CANDY PLAYGROUND
   ========================================================================== */
function initPhysicsCandies() {
  const sandbox = document.getElementById("candySandbox");
  const candyElements = document.querySelectorAll(".physics-candy-item");
  const respawnBtn = document.getElementById("respawnCandyBtn");

  if (!sandbox || !candyElements.length) return;

  // Physics simulation state for each candy
  let candies = [];
  const gravity = 0.48;
  const bounceRestitution = 0.42;
  const floorFriction = 0.94;
  const airFriction = 0.992;

  let isDragging = false;
  let draggedCandy = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let pointerVelocityX = 0;
  let pointerVelocityY = 0;

  function spawnCandies() {
    const boxWidth = sandbox.clientWidth;
    const boxHeight = sandbox.clientHeight;

    candies = Array.from(candyElements).map((el, index) => {
      const width = el.offsetWidth || 130;
      const height = el.offsetHeight || 180;
      const startX = (boxWidth / (candyElements.length + 1)) * (index + 1) - (width / 2) + (Math.random() * 40 - 20);
      const startY = -(height + Math.random() * 200 + index * 40);
      const angle = (Math.random() - 0.5) * 60;

      return {
        el,
        x: Math.max(10, Math.min(boxWidth - width - 10, startX)),
        y: startY,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 2,
        rot: angle,
        vrot: (Math.random() - 0.5) * 4,
        width,
        height,
        radius: Math.min(width, height) * 0.45,
        isHeld: false
      };
    });
  }

  // Animation Loop (60 FPS Verlet / Euler Physics)
  let animationFrameId;
  function physicsLoop() {
    const boxWidth = sandbox.clientWidth;
    const boxHeight = sandbox.clientHeight;

    candies.forEach(candy => {
      if (candy.isHeld) {
        // Position directly follows mouse/touch
        candy.x = lastPointerX - dragOffsetX;
        candy.y = lastPointerY - dragOffsetY;
        candy.vx = pointerVelocityX;
        candy.vy = pointerVelocityY;
        candy.vrot = pointerVelocityX * 0.3;
      } else {
        // Apply Gravity & Air Drag
        candy.vy += gravity;
        candy.vx *= airFriction;
        candy.vy *= airFriction;
        candy.vrot *= 0.98;

        candy.x += candy.vx;
        candy.y += candy.vy;
        candy.rot += candy.vrot;

        // Floor Collision
        const floorY = boxHeight - candy.height + 15; // sink slightly into floor
        if (candy.y > floorY) {
          candy.y = floorY;
          candy.vy = -candy.vy * bounceRestitution;
          candy.vx *= floorFriction;
          candy.vrot *= floorFriction;
          if (Math.abs(candy.vy) < 0.6) candy.vy = 0;
        }

        // Left & Right Wall Collisions
        if (candy.x < 5) {
          candy.x = 5;
          candy.vx = -candy.vx * 0.7;
          candy.vrot = -candy.vrot * 0.8;
        } else if (candy.x > boxWidth - candy.width - 5) {
          candy.x = boxWidth - candy.width - 5;
          candy.vx = -candy.vx * 0.7;
          candy.vrot = -candy.vrot * 0.8;
        }

        // Ceiling boundary
        if (candy.y < -300) {
          candy.y = -300;
          candy.vy = 0;
        }
      }

      // Soft repulsion between candies (so they pile up naturally)
      candies.forEach(other => {
        if (candy === other) return;
        const dx = (candy.x + candy.width / 2) - (other.x + other.width / 2);
        const dy = (candy.y + candy.height / 2) - (other.y + other.height / 2);
        const dist = Math.hypot(dx, dy);
        const minDist = candy.radius + other.radius;

        if (dist < minDist && dist > 0.01) {
          const overlap = (minDist - dist) * 0.15;
          const nx = dx / dist;
          const ny = dy / dist;

          if (!candy.isHeld) {
            candy.x += nx * overlap;
            candy.y += ny * overlap;
            candy.vx += nx * 0.4;
          }
          if (!other.isHeld) {
            other.x -= nx * overlap;
            other.y -= ny * overlap;
            other.vx -= nx * 0.4;
          }
        }
      });

      // Render transform
      candy.el.style.transform = `translate3d(${candy.x}px, ${candy.y}px, 0) rotate(${candy.rot}deg)`;
    });

    animationFrameId = requestAnimationFrame(physicsLoop);
  }

  // Pointer / Drag Event Listeners
  function handlePointerDown(e) {
    const rect = sandbox.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // Check hit on candy
    for (let i = candies.length - 1; i >= 0; i--) {
      const c = candies[i];
      if (mouseX >= c.x && mouseX <= c.x + c.width &&
          mouseY >= c.y && mouseY <= c.y + c.height) {
        isDragging = true;
        draggedCandy = c;
        c.isHeld = true;
        dragOffsetX = mouseX - c.x;
        dragOffsetY = mouseY - c.y;
        lastPointerX = mouseX;
        lastPointerY = mouseY;
        pointerVelocityX = 0;
        pointerVelocityY = 0;

        // Bring clicked candy to visual front
        candyElements.forEach(el => el.style.zIndex = "1");
        c.el.style.zIndex = "10";
        break;
      }
    }
  }

  function handlePointerMove(e) {
    if (!isDragging || !draggedCandy) return;
    const rect = sandbox.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    pointerVelocityX = (mouseX - lastPointerX) * 0.8;
    pointerVelocityY = (mouseY - lastPointerY) * 0.8;
    lastPointerX = mouseX;
    lastPointerY = mouseY;
  }

  function handlePointerUp() {
    if (isDragging && draggedCandy) {
      draggedCandy.isHeld = false;
      draggedCandy.vx = pointerVelocityX;
      draggedCandy.vy = pointerVelocityY;
      isDragging = false;
      draggedCandy = null;
    }
  }

  sandbox.addEventListener("mousedown", handlePointerDown);
  window.addEventListener("mousemove", handlePointerMove);
  window.addEventListener("mouseup", handlePointerUp);

  sandbox.addEventListener("touchstart", handlePointerDown, { passive: true });
  window.addEventListener("touchmove", handlePointerMove, { passive: true });
  window.addEventListener("touchend", handlePointerUp, { passive: true });

  if (respawnBtn) {
    respawnBtn.addEventListener("click", () => {
      spawnCandies();
      fireCandyConfetti();
      showToast("Fresh Ring Pops dropped into the playground!");
    });
  }

  // Start after brief delay for layout calculation
  setTimeout(() => {
    spawnCandies();
    physicsLoop();
  }, 350);

  // Resize handler
  window.addEventListener("resize", () => {
    const boxWidth = sandbox.clientWidth;
    candies.forEach(c => {
      if (c.x > boxWidth - c.width) c.x = boxWidth - c.width - 10;
    });
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATION & CONFETTI
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add("active");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("active");
  }, 3200);
}

function fireCandyConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#FFF200", "#E1251B", "#2364E7", "#64F525", "#FF91B7"]
    });
  }
}

/* ==========================================================================
   11. BACK TO TOP
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById("backToTopBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

