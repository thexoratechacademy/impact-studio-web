// Load navbar for sections pages
document.addEventListener("DOMContentLoaded", () => {
  fetch("../components/navbar.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("navbar-placeholder").innerHTML = html;
      // Hamburger menu
      const hamburger = document.querySelector(".hamburger-menu");
      const navLinks = document.querySelector(".nav-links");
      hamburger?.addEventListener("click", () => {
        navLinks?.classList.toggle("active");
      });
      document.addEventListener("click", (event) => {
        if (!navLinks?.contains(event.target) && !hamburger?.contains(event.target)) {
          navLinks?.classList.remove("active");
        }
      });
      // Dropdown
      const dropdown = document.querySelector(".dropdown");
      const dropdownMenu = document.querySelector(".dropdown-menu");
      if (window.innerWidth >= 1024) {
        dropdown?.addEventListener("mouseenter", () => dropdownMenu.style.display = "block");
        dropdown?.addEventListener("mouseleave", () => {
          setTimeout(() => {
            if (!dropdownMenu.matches(":hover")) dropdownMenu.style.display = "none";
          }, 100);
        });
        dropdownMenu?.addEventListener("mouseenter", () => dropdownMenu.style.display = "block");
      } else {
        dropdown?.addEventListener("click", (e) => {
          e.stopPropagation();
          dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });
      }
      document.addEventListener("click", () => dropdownMenu.style.display = "none");
    })
    .catch((err) => console.error("Navbar load failed:", err));
});
