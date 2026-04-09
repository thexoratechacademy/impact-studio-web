// Inject the navbar component into the homepage(index.html).
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

// Inject the  course-overview component into the homepage(web-development.html).
document.addEventListener("DOMContentLoaded", () => {
  fetch("../sections/full-stack-course-overview.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("course-overview-placeholder").innerHTML = html;

      // --- MOBILE LOGIC ---
      document
        .querySelectorAll(".course-overview-heading")
        .forEach((button) => {
          button.addEventListener("click", () => {
            const answer = button.nextElementSibling;
            const isMobile = window.innerWidth <= 1023;
            if (isMobile) {
              answer.classList.toggle("active");
            }
          });
        });
      // --- DESKTOP LOGIC ---
      const features = document.querySelectorAll(".features li");
      const sections = document.querySelectorAll(".features-content > div");
      function handleDesktopTabs() {
        features.forEach((item) => {
          item.addEventListener("click", () => {
            const section = item.dataset.section;
            features.forEach((f) => f.classList.remove("active"));
            item.classList.add("active");
            sections.forEach((s) => {
              s.classList.toggle("active", s.dataset.section === section);
            });
          });
        });
      }
      window.addEventListener("resize", () => {
        if (window.innerWidth >= 1024) {
          handleDesktopTabs();
        }
      });
      // Run on load if already in desktop view
      if (window.innerWidth >= 1024) {
        handleDesktopTabs();
      }

      // --- FAQ BUTTONS INTERACTIVITY ---
      const faqQuestions = document.querySelectorAll(".FAQs-question");
      faqQuestions.forEach((button) => {
        button.addEventListener("click", () => {
          const answer = button.nextElementSibling;
          const chevron = button.querySelector("img");
          if (answer && answer.classList.contains("faq-answer")) {
            if (answer.style.display === "none") {
              answer.style.display = "block";
              if (chevron) {
                chevron.style.transform = "rotate(180deg)";
                chevron.style.transition = "transform 0.3s ease";
              }
            } else {
              answer.style.display = "none";
              if (chevron) {
                chevron.style.transform = "rotate(0deg)";
              }
            }
          }
        });
      });

      // --- MODULE BUTTONS INTERACTIVITY ---
      const moduleBtns = document.querySelectorAll(".modules-buttons button");
      const moduleDisplay = document.getElementById("module-display-text");
      
      if (moduleBtns.length > 0 && moduleDisplay) {
        moduleBtns.forEach(btn => {
          btn.addEventListener("click", () => {
            moduleDisplay.innerText = btn.getAttribute("data-content");
            moduleBtns.forEach(b => {
              b.style.backgroundColor = "";
              b.style.color = "";
            });
            btn.style.backgroundColor = "#035472";
            btn.style.color = "#ffffff";
          });
        });
      }
    })

    .catch((err) => console.error("Failed to load course overview:", err));
});

// Inject the getting-started component into the homepage(web-development.html).
document.addEventListener("DOMContentLoaded", () => {
  fetch("../sections/getting-started.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("getting-started-placeholder").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));
});
// Inject the  Sponsors and footer component into the homepage(index.html).
document.addEventListener("DOMContentLoaded", () => {
  // Access Us Section
  fetch("../sections/working-with-us.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("accessing-us-section-placeholder").innerHTML =
        html;
    });
  // Sponsors Section
  fetch("../sections/sponsors.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("sponsors-section-placeholder").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));
  // Footer
  fetch("../components/footer.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("footer-placeholder").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));
});
