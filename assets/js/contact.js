// Load navbar
document.addEventListener("DOMContentLoaded", () => {
  fetch("../../components/navbar.html")
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
  fetch("../../components/footer.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("footer-placeholder").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));
});

// Contact form — simple front-end submission handler
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const successMsg = document.getElementById("form-success");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Basic validation
      const required = form.querySelectorAll("[required]");
      let valid = true;
      required.forEach((field) => {
        if (!field.value.trim()) {
          field.style.borderColor = "#e74040";
          valid = false;
        } else {
          field.style.borderColor = "";
        }
      });
      if (!valid) return;

      // Simulate sending (replace with real API call when ready)
      const btn = form.querySelector(".contact-submit");
      btn.textContent = "Sending…";
      btn.disabled = true;

      setTimeout(() => {
        form.reset();
        btn.innerHTML = 'Send Message <i class="ri-send-plane-line"></i>';
        btn.disabled = false;
        successMsg.classList.add("visible");
        setTimeout(() => successMsg.classList.remove("visible"), 5000);
      }, 1200);
    });

    // Clear red border on input
    form.querySelectorAll("input, select, textarea").forEach((el) => {
      el.addEventListener("input", () => (el.style.borderColor = ""));
    });
  }
});
