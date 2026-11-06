/* ==========================================================================
   8. NEWSLETTER CONFETTI FORM & SUBMISSION
   ========================================================================== */
window.handleNewsletterSubmit = function(e) {
  e.preventDefault();
  const emailInput = document.getElementById("newsletterEmail");
  const successBox = document.getElementById("newsletterSuccess");
  const form = document.getElementById("newsletterForm");

  if (!emailInput || !emailInput.value) return;

  if (typeof fireCandyConfetti === "function") {
    fireCandyConfetti();
  }
  
  if (form) form.style.display = "none";
  if (successBox) successBox.style.display = "block";
  
  if (typeof showToast === "function") {
    showToast("Welcome to the Ring Pop Celebration Crew!");
  }
};
