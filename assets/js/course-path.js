// Helper to get elements (moved inside to be safer)
const getElements = () => ({
  steps: document.querySelectorAll(".form-container"),
  stepIndicators: document.querySelectorAll(".enroll-steps div"),
  prevBtns: document.querySelectorAll(".previous"),
  nextBtns: document.querySelectorAll(".next-btn"),
  stepLabels: document.querySelectorAll(".step-label"),
  stepNumbers: document.querySelectorAll(".step")
});

let currentStep = 0;

function updateFormSteps() {
  const el = getElements();
  
  el.steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });
  
  el.stepLabels.forEach((label, index) => {
    label.classList.toggle("active", index === currentStep);
  });
  
  el.stepNumbers.forEach((number, index) => {
    number.classList.toggle("active", index === currentStep);
  });

  el.stepIndicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentStep);
  });

  el.prevBtns.forEach((btn) => {
    btn.style.display = currentStep === 0 ? "none" : "inline-block";
  });

  el.nextBtns.forEach((btn) => {
    const isLastStep = currentStep === el.steps.length - 1;
    btn.textContent = isLastStep ? "Submit" : "Next";
    // If it's the submit button, ensure it has the submit type
    if (isLastStep) {
      btn.type = "submit";
    } else {
      btn.type = "button";
    }
  });
}

// Delegate events to the form for better reliability
document.addEventListener("click", (e) => {
  // Handle Next button
  if (e.target.closest(".next-btn")) {
    const el = getElements();
    // Only proceed if NOT the last step (let the form submit handle that)
    if (currentStep < el.steps.length - 1) {
      e.preventDefault();
      
      // Simple validation for current step
      const currentFields = el.steps[currentStep].querySelectorAll("[required]");
      let isValid = true;
      currentFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add("error-shake");
          setTimeout(() => field.classList.remove("error-shake"), 500);
          isValid = false;
        }
      });

      if (isValid) {
        currentStep++;
        updateFormSteps();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    // If it is the last step, we don't preventDefault() so the form can submit
  }

  // Handle Previous button
  if (e.target.closest(".previous")) {
    e.preventDefault();
    if (currentStep > 0) {
      currentStep--;
      updateFormSteps();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateFormSteps();

  // Inject Navbar
  fetch("../components/navbar.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("navbar-placeholder").innerHTML = html;
      initNavbarActions();
    })
    .catch((err) => console.error("Failed to load navbar:", err));

  // Inject Footer
  fetch("../components/footer.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("footer-placeholder").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));
});

function initNavbarActions() {
  const hamburger = document.querySelector(".hamburger-menu");
  const navLinks = document.querySelector(".nav-links");
  
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    navLinks.classList.add("active");
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
      navLinks.classList.remove("active");
    }
  });

  // Mobile behavior for dropdowns
  const dropdown = document.querySelector(".dropdown");
  const dropdownMenu = document.querySelector(".dropdown-menu");
  if (dropdown && dropdownMenu) {
    dropdown.addEventListener("click", (e) => {
      if (window.innerWidth < 1024) {
        const isOpen = dropdownMenu.style.display === "block";
        dropdownMenu.style.display = isOpen ? "none" : "block";
      }
    });
  }
}
