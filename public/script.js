// JavaScript to toggle the hamburger menu on mobile
function toggleMenu() {
    const menu = document.getElementById("hamburger-links");
    const body = document.body;  // Get the body element
    menu.classList.toggle("show");

    // Toggle the padding for the body when the menu is open
    body.classList.toggle("menu-open", menu.classList.contains("show"));
}

// Add more interactive effects if needed in the future
document.querySelector('.submit-btn').addEventListener('mouseover', function() {
    this.style.transform = 'scale(1.1)';
});

document.querySelector('.submit-btn').addEventListener('mouseout', function() {
    this.style.transform = 'scale(1)';
});


let startX = 0;

document.querySelector('.neon-collage').addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

document.querySelector('.neon-collage').addEventListener('touchend', (e) => {
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