document.addEventListener("DOMContentLoaded", () => {
  fetch("../components/navbar.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("navbar-placeholder").innerHTML = html;
      const hamburger = document.querySelector(".hamburger-menu");
      const navLinks = document.querySelector(".nav-links");
      hamburger.addEventListener("click", () => navLinks.classList.add("active"));
      document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
          navLinks.classList.remove("active");
        }
      });
      const dropdown = document.querySelector(".dropdown");
      const dropdownMenu = document.querySelector(".dropdown-menu");
      if (window.innerWidth >= 1024) {
        dropdown.addEventListener("mouseenter", () => (dropdownMenu.style.display = "block"));
        dropdown.addEventListener("mouseleave", () => {
          setTimeout(() => { if (!dropdownMenu.matches(":hover")) dropdownMenu.style.display = "none"; }, 2000);
        });
        dropdownMenu.addEventListener("mouseenter", () => (dropdownMenu.style.display = "block"));
        document.addEventListener("click", (e) => {
          if (!dropdown.contains(e.target) && !dropdownMenu.contains(e.target)) dropdownMenu.style.display = "none";
        });
      } else {
        dropdown.addEventListener("click", () => {
          dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });
      }
    })
    .catch((err) => console.error("Failed to load navbar:", err));
});

// Load footer
document.addEventListener("DOMContentLoaded", () => {
  fetch("../components/footer.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("footer-placeholder").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));
});

// Contact form handler
// Note: The main form logic is now in honeypot.js setupFormHandler()
// This file is for contact-page-specific functionality only

document.addEventListener("DOMContentLoaded", () => {
  // Clear red border on input
  const form = document.getElementById('contact-form');
  if (form) {
    form.querySelectorAll("input, select, textarea").forEach((el) => {
      el.addEventListener("input", () => (el.style.borderColor = ""));
    });
    
    console.log('✅ Contact form page loaded');
  }
});
