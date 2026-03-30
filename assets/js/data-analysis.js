// Inject course-overview section for Data Analysis
document.addEventListener("DOMContentLoaded", () => {
  fetch("../../Sections/data-analysis-path.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById(
        "course-overview-data-analysis-placeholder"
      ).innerHTML = html;

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
      if (window.innerWidth >= 1024) {
        handleDesktopTabs();
      }

      // --- MODULE BUTTONS INTERACTIVITY ---
      const moduleBtns = document.querySelectorAll(".modules-buttons button");
      const moduleDisplay = document.getElementById("module-display-text");
      
      if (moduleBtns.length > 0 && moduleDisplay) {
        moduleBtns.forEach(btn => {
          btn.addEventListener("click", () => {
            // Update the display text with the content embedded in the button's data attribute
            moduleDisplay.innerText = btn.getAttribute("data-content");
            
            // Highlight the active button visually
            moduleBtns.forEach(b => {
              b.style.backgroundColor = "";
              b.style.color = "";
            });
            btn.style.backgroundColor = "#035472"; // Using the site's primary teal color
            btn.style.color = "#ffffff";
          });
        });
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
    })
    .catch((err) => console.error("Failed to load data analysis overview:", err));
});
