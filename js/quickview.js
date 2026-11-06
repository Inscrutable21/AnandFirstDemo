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
