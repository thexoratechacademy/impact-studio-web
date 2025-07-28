// Inject the navbar component into the homepage(index.html).
document.addEventListener("DOMContentLoaded", () => {
  fetch("components/navbar.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("navbar-placeholder").innerHTML = html;
      // Hamburger Menubar
      const hamburger = document.querySelector(".hamburger-menu");
      const navLinks = document.querySelector(".nav-links");
      const navBtn = document.querySelectorAll(".nav-links ul li a");
      const enrollBtn = document.querySelector(".nav-button btn");
      hamburger.addEventListener("click", () => {
        navLinks.classList.add("active");
      });
      navBtn.forEach((nav) => {
        nav.addEventListener("click", (e) => {});
      });
      document.addEventListener("click", (event) => {
        if (
          !navLinks.contains(event.target) &&
          !hamburger.contains(event.target)
        ) {
          navLinks.classList.remove("active");
        }
      });
      //Drop-down Menu
      const dropdown = document.querySelector(".dropdown");
      const dropdownMenu = document.querySelector(".dropdown-menu");

      if (window.innerWidth >= 1024) {
        dropdown.addEventListener("mouseenter", function () {
          dropdownMenu.style.display = "block";
        });
        dropdown.addEventListener("mouseleave", function () {
          setTimeout(function () {
            if (!dropdownMenu.matches(":hover")) {
              dropdownMenu.style.display = "none";
            }
          }, 2000);
        });
        dropdownMenu.addEventListener("mouseenter", function () {
          dropdownMenu.style.display = "block";
        });
        document.addEventListener("click", function (event) {
          if (
            !dropdown.contains(event.target) &&
            !dropdownMenu.contains(event.target)
          ) {
            dropdownMenu.style.display = "none";
          }
        });
      } else {
        {
          // Mobile behavior (click toggle)
          dropdown.addEventListener("click", () => {
            const isOpen = dropdownMenu.style.display === "block";
            dropdownMenu.style.display = isOpen ? "none" : "block";
          });
        }
      }
    })

    .catch((err) => console.error("Failed to load navbar:", err));
});
// Inject the section component into the homepage.
document.addEventListener("DOMContentLoaded", () => {
  // Hero-Section
  fetch("Sections/hero-section.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("hero-section-placeholder").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));
  // Course-Path Section
  fetch("Sections/course-path-section.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("course-path-section-placeholder").innerHTML =
        html;
    });
  // Access Us Section
  fetch("Sections/Access-us-section.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("accessing-us-section-placeholder").innerHTML =
        html;
    });
  // Sponsors Section
  fetch("Sections/sponsors.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("sponsors-section-placeholder").innerHTML = html;
    })

    .catch((err) => console.error("Failed to load footer:", err));
});
// Inject the footer component into the homepage(index.html).
document.addEventListener("DOMContentLoaded", () => {
  fetch("components/footer.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("footer-placeholder").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));
});
