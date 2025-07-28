// Inject the  course-overview component into the homepage(web-development.html).
document.addEventListener("DOMContentLoaded", () => {
  fetch("../../Sections/mobile-path.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("course-overview-mobile-placeholder").innerHTML =
        html;
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
    })
    .catch((err) => console.error("Failed to load footer:", err));
});
