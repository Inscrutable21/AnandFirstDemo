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
