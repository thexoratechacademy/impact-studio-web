document.addEventListener("DOMContentLoaded", () => {
  fetch("../components/navbar.html")
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

document.addEventListener("DOMContentLoaded", () => {
  fetch("../sections/mission-section.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("mission-section").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));
});

//injection for Core Value
document.addEventListener("DOMContentLoaded", () => {
  fetch("../sections/Core-Val-Section.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("core-values-section").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));
});

//injection for Our Teams
document.addEventListener("DOMContentLoaded", () => {
  fetch("../sections/Team-section.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("Team-section").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("../components/footer.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("footer-placeholder").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));
});
