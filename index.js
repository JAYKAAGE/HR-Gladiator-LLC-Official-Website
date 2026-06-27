/* ============================================
   HR GLADIATOR — Homepage Scripts
   ============================================ */

// Footer year
document.getElementById('footer-year').textContent = new Date().getFullYear();

// Animate hero elements on load
window.addEventListener('load', () => {
  document.querySelectorAll('.animate-up').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.15}s`;
  });
});
