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
