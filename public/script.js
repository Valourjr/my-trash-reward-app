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