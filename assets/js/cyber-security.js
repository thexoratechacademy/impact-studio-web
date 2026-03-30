// Inject course-overview section for Cyber Security
document.addEventListener("DOMContentLoaded", () => {
  fetch("../../Sections/cyber-security-path.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById(
        "course-overview-cyber-security-placeholder"
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
      setTimeout(() => {
        const faqQuestions = document.querySelectorAll(".FAQs-question");
        console.log("Cybersecurity FAQ buttons found:", faqQuestions.length);
        
        faqQuestions.forEach((button) => {
          button.addEventListener("click", function() {
            const answer = this.nextElementSibling;
            const chevron = this.querySelector("img");
            console.log("FAQ clicked, answer:", answer);
            
            if (answer && answer.classList.contains("faq-answer")) {
              const isVisible = window.getComputedStyle(answer).display !== "none";
              
              if (!isVisible) {
                answer.style.setProperty("display", "block", "important");
                if (chevron) {
                  chevron.style.transform = "rotate(180deg)";
                  chevron.style.transition = "transform 0.3s ease";
                }
              } else {
                answer.style.removeProperty("display");
                answer.style.display = "none";
                if (chevron) {
                  chevron.style.transform = "rotate(0deg)";
                }
              }
            }
          });
        });
      }, 50);
    })
    .catch((err) => console.error("Failed to load cyber security overview:", err));
});
