"""
Build Script for Ring Pop Website
Compiles sections/*.html into index.html
Can be run via: python build.py or node build.js
"""
import os

SECTIONS_ORDER = [
    ("announcement-bar.html", "Top Announcement Bar"),
    ("header.html", "Header & Navigation"),
    ("mobile-drawer.html", "Mobile Menu Drawer"),
    ("hero.html", "Section 1: Hero Carousel"),
    ("wedding-feature.html", "Section 2: Wedding & Bridal Box"),
    ("marquee.html", "Section 3: Scrolling Marquee Bar"),
    ("stacking-cards.html", "Sections 4-8: Signature Stacking Cards"),
    ("ugc-testimonials.html", "Section 9: Customer UGC Inspiration"),
    ("promo-banner.html", "Section 10: High-Energy Promo Banner"),
    ("newsletter.html", "Section 11: Newsletter Signup"),
    ("about.html", "Section 12: About Us & Brand History"),
    ("footer.html", "Section 13: Draggable Physics Candy Footer"),
    ("cart-drawer.html", "Shopping Cart Drawer Modal"),
    ("quickview-modal.html", "Quick View Modal"),
    ("search-modal.html", "Search Modal"),
    ("toast.html", "Floating Toast Notification")
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SECTIONS_DIR = os.path.join(BASE_DIR, "sections")
OUTPUT_HTML = os.path.join(BASE_DIR, "index.html")

def build():
    # Read sections
    sections_content = {}
    for filename, name in SECTIONS_ORDER:
        filepath = os.path.join(SECTIONS_DIR, filename)
        if not os.path.exists(filepath):
            print(f"Error: {filepath} not found!")
            return
        with open(filepath, "r", encoding="utf-8") as f:
            sections_content[filename] = f.read().strip()

    # Construct full HTML
    html = f"""<!DOCTYPE html>
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
  {sections_content['announcement-bar.html']}

  <!-- ==================== SECTION: Header & Mega Menu ==================== -->
  {sections_content['header.html']}

  <!-- ==================== SECTION: Mobile Menu Drawer ==================== -->
  {sections_content['mobile-drawer.html']}

  <main id="mainContent">
    <!-- ==================== SECTION: Hero Carousel ==================== -->
    {sections_content['hero.html']}

    <!-- ==================== SECTION: Wedding Feature ==================== -->
    {sections_content['wedding-feature.html']}

    <!-- ==================== SECTION: Scrolling Marquee ==================== -->
    {sections_content['marquee.html']}

    <!-- ==================== SECTIONS 4-8: Stacking Cards ==================== -->
    {sections_content['stacking-cards.html']}

    <!-- ==================== SECTION: Customer UGC ==================== -->
    {sections_content['ugc-testimonials.html']}

    <!-- ==================== SECTION: Promo Banner ==================== -->
    {sections_content['promo-banner.html']}

    <!-- ==================== SECTION: Newsletter ==================== -->
    {sections_content['newsletter.html']}

    <!-- ==================== SECTION: About 1977 Legacy ==================== -->
    {sections_content['about.html']}
  </main>

  <!-- ==================== SECTION: Footer & Physics Sandbox ==================== -->
  {sections_content['footer.html']}

  <!-- ==================== MODALS & DRAWERS ==================== -->
  {sections_content['cart-drawer.html']}
  {sections_content['quickview-modal.html']}
  {sections_content['search-modal.html']}
  {sections_content['toast.html']}

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
"""

    with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Successfully compiled {len(SECTIONS_ORDER)} sections into index.html ({len(html)} bytes)")

if __name__ == "__main__":
    build()

