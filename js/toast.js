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
