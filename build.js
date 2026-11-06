/**
 * Node.js Build Script for Ring Pop Website
 * Compiles sections/*.html into index.html
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');

const SECTIONS_ORDER = [
  'announcement-bar.html',
  'header.html',
  'mobile-drawer.html',
  'hero.html',
  'wedding-feature.html',
  'marquee.html',
  'stacking-cards.html',
  'ugc-testimonials.html',
  'promo-banner.html',
  'newsletter.html',
  'about.html',
  'footer.html',
  'cart-drawer.html',
  'quickview-modal.html',
  'search-modal.html',
  'toast.html'
];

const sectionsDir = path.join(__dirname, 'sections');
const outputFile = path.join(__dirname, 'index.html');

const sections = {};
SECTIONS_ORDER.forEach(file => {
  const filePath = path.join(sectionsDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: ${filePath} does not exist!`);
    process.exit(1);
  }
  sections[file] = fs.readFileSync(filePath, 'utf8').trim();
});

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ring Pop® — Candy for Every Celebration</title>
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="assets/favicon-compressed.png">
  
  <!-- Adobe Typekit & Google Fonts -->
  <link rel="stylesheet" href="https://use.typekit.net/osd2mpu.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Syne:wght@700;800;900&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Modular Stylesheets -->
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- ==================== SECTION: Announcement Bar ==================== -->
  ${sections['announcement-bar.html']}

  <!-- ==================== SECTION: Header & Mega Menu ==================== -->
  ${sections['header.html']}

  <!-- ==================== SECTION: Mobile Menu Drawer ==================== -->
  ${sections['mobile-drawer.html']}

  <main id="mainContent">
    <!-- ==================== SECTION: Hero Carousel ==================== -->
    ${sections['hero.html']}

    <!-- ==================== SECTION: Wedding Feature ==================== -->
    ${sections['wedding-feature.html']}

    <!-- ==================== SECTION: Scrolling Marquee ==================== -->
    ${sections['marquee.html']}

    <!-- ==================== SECTIONS 4-8: Stacking Cards ==================== -->
    ${sections['stacking-cards.html']}

    <!-- ==================== SECTION: Customer UGC ==================== -->
    ${sections['ugc-testimonials.html']}

    <!-- ==================== SECTION: Promo Banner ==================== -->
    ${sections['promo-banner.html']}

    <!-- ==================== SECTION: Newsletter ==================== -->
    ${sections['newsletter.html']}

    <!-- ==================== SECTION: About 1977 Legacy ==================== -->
    ${sections['about.html']}
  </main>

  <!-- ==================== SECTION: Footer & Physics Sandbox ==================== -->
  ${sections['footer.html']}

  <!-- ==================== MODALS & DRAWERS ==================== -->
  ${sections['cart-drawer.html']}
  ${sections['quickview-modal.html']}
  ${sections['search-modal.html']}
  ${sections['toast.html']}

  <!-- Third-Party Libraries -->
  <script src="libs/gsap.min.js"></script>
  <script src="libs/ScrollTrigger.min.js"></script>
  <script src="libs/canvas-confetti.min.js"></script>

  <!-- Modular Section JavaScript Files -->
  <script src="js/header.js"></script>
  <script src="js/hero.js"></script>
  <script src="js/stacking-cards.js"></script>
  <script src="js/ugc.js"></script>
  <script src="js/newsletter.js"></script>
  <script src="js/cart.js"></script>
  <script src="js/quickview.js"></script>
  <script src="js/search.js"></script>
  <script src="js/physics-candy.js"></script>
  <script src="js/toast.js"></script>
  <script src="js/audio.js"></script>
  <script src="js/back-to-top.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
`;

fs.writeFileSync(outputFile, fullHtml, 'utf8');
console.log(`Successfully compiled ${SECTIONS_ORDER.length} sections into index.html (${fullHtml.length} bytes)`);

