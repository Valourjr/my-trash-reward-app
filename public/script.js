// Toggle hamburger menu
function toggleMenu() {
  const menu = document.getElementById("hamburger-links");
  const body = document.body;
  menu.classList.toggle("show");
  body.classList.toggle("menu-open", menu.classList.contains("show"));
}

const hamburgerBtn = document.querySelector('.hamburger-button');
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', toggleMenu);
}

// Button hover animation
const submitBtn = document.querySelector('.submit-btn');
if (submitBtn) {
  submitBtn.addEventListener('mouseover', () => submitBtn.style.transform = 'scale(1.1)');
  submitBtn.addEventListener('mouseout', () => submitBtn.style.transform = 'scale(1)');
}

// Touch interaction
const collage = document.querySelector('.neon-collage');
if (collage) {
  let startX = 0;

  collage.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  collage.addEventListener('touchend', (e) => {
    let endX = e.changedTouches[0].clientX;
    if (Math.abs(endX - startX) > 50) {
      document.querySelectorAll('.panel').forEach(p => {
        p.style.animation = 'shake 0.5s';
        p.addEventListener('animationend', () => {
          p.style.animation = '';
        }, { once: true });
      });
    }
  });
}