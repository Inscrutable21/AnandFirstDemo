# Ring Pop® Website — Modular Architecture

This project is a modular, high-fidelity replica of the official [Ring Pop® Website](https://ringpopcandy.com/) (designed by Manufactur, Awwwards Honorable Mention).

Every section of the website has been divided into independent, modular files across **HTML**, **CSS**, and **JavaScript**.

---

## Directory Structure

```
d:\Website_Animation\
│
├── index.html                   # Master entry HTML (compiled from sections)
├── build.js                     # Node.js compiler (sections/*.html -> index.html)
├── build.py                     # Python compiler (sections/*.html -> index.html)
├── watch.js                     # Live watcher for instant recompilation
├── style.css                    # Master stylesheet (imports modular CSS)
│
├── sections/                    # Modular HTML Section Partials
│   ├── announcement-bar.html    # Top announcement banner
│   ├── header.html              # Sticky pill header & mega-menu
│   ├── mobile-drawer.html       # Offcanvas mobile drawer menu
│   ├── hero.html                # Hero carousel & floating gems
│   ├── wedding-feature.html     # Themed bridal card & Polaroid sticker
│   ├── marquee.html             # Continuous scrolling badge ticker
│   ├── stacking-cards.html      # 5 signature stacking pinned cards
│   ├── ugc-testimonials.html    # Customer inspiration & social lookbook
│   ├── promo-banner.html        # "Wear The Party" promo banner
│   ├── lookbook.html            # Editorial style report & festival lookbook
│   ├── newsletter.html          # "Stay In The Loop" email signup
│   ├── about.html               # 1977 Frank Richards invention story
│   ├── footer.html              # Interactive draggable physics candy & footer
│   ├── cart-drawer.html         # Sliding shopping bag & shipping meter
│   ├── quickview-modal.html     # Flavor selector & pack size modal
│   ├── search-modal.html        # Live search overlay with instant results
│   └── toast.html               # Celebratory toast notification
│
├── css/                         # Modular Section Stylesheets
│   ├── variables.css            # Brand colors, typography tokens, base resets
│   ├── announcement-bar.css     # Announcement bar styles
│   ├── header.css               # Navigation pill & actions
│   ├── mega-menu.css            # 5-column dropdown mega menu
│   ├── mobile-drawer.css        # Mobile drawer navigation
│   ├── hero.css                 # Hero carousel & floating gem animations
│   ├── wedding-feature.css      # Bridal card & Polaroid sticker
│   ├── marquee.css              # Infinite ticker animation
│   ├── stacking-cards.css       # Sticky card stacking & 3D shadows
│   ├── ugc-testimonials.css     # Drag-scrollable customer cards
│   ├── promo-banner.css         # High-energy gradient banner
│   ├── lookbook.css             # 2-column editorial magazine layout
│   ├── newsletter.css           # Electric blue subscription box
│   ├── about.css                # 1977 timeline & stat counters
│   ├── footer.css               # Draggable candy sandbox & giant logo
│   ├── cart-drawer.css          # Shopping cart drawer & free shipping meter
│   ├── quickview-modal.css      # Quick view pop-up & flavor pills
│   ├── search-modal.css         # Search overlay & result items
│   ├── toast.css                # Pop toast notification
│   ├── responsive.css           # Tablet and mobile media queries
│   └── style.css                # CSS aggregator
│
├── js/                          # Modular Section Scripts
│   ├── header.js                # Sticky scroll & mega-menu toggles
│   ├── hero.js                  # Hero carousel, swipe, & autoplay
│   ├── stacking-cards.js        # GSAP ScrollTrigger card pinning & parallax
│   ├── ugc.js                   # Mouse-drag horizontal scroll
│   ├── newsletter.js            # Email validation & confetti burst
│   ├── cart.js                  # Cart state, shipping meter, & promo code
│   ├── quickview.js             # Flavor switching & quick add
│   ├── search.js                # Live filtering & keyword triggers
│   ├── physics-candy.js         # 2D Verlet physics candy sandbox
│   ├── toast.js                 # Toast notifications
│   ├── back-to-top.js           # Smooth back to top scroll
│   └── main.js                  # Master initialization orchestrator
│
├── assets/                      # 38 authentic high-res brand images & SVGs
└── libs/                        # Local GSAP, ScrollTrigger & Canvas Confetti
```

---

## How to Edit & Build

1. **Edit any section** directly in [`sections/<name>.html`](file:///d:/Website_Animation/sections/).
2. **Edit styles** directly in [`css/<name>.css`](file:///d:/Website_Animation/css/).
3. **Edit scripts** directly in [`js/<name>.js`](file:///d:/Website_Animation/js/).
4. **Recompile HTML**:
   ```bash
   node build.js
   # or
   python build.py
   ```
5. **Auto-Recompile on Save**:
   ```bash
   node watch.js
   ```

---

## Previewing

Open [**`index.html`**](file:///d:/Website_Animation/index.html) in your browser, or start a local server:
```bash
python -m http.server 8080
```
Then visit `http://localhost:8080`.

