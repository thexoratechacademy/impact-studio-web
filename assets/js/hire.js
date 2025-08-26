document.addEventListener("DOMContentLoaded", async () => {
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  const hirePlaceholder = document.getElementById("hire-top-talent");
  const topPlaceholder = document.getElementById("top-talent");
  const footerPlaceholder = document.getElementById("footer-placeholder");

  try {
    // Check cache first
    const cachedNavbar = localStorage.getItem("navbar-html");
    const cachedHire = localStorage.getItem("hire-top-talent-html");
    const cachedTop = localStorage.getItem("top-talent-html");
    const cachedFooter = localStorage.getItem("footer-html");

    if (cachedNavbar && cachedHire && cachedTop && cachedFooter) {
      navbarPlaceholder.innerHTML = cachedNavbar;
      hirePlaceholder.innerHTML = cachedHire;
      topPlaceholder.innerHTML = cachedTop;
      footerPlaceholder.innerHTML = cachedFooter;
    } else {
      // Fetch all resources concurrently
      const [navbarResponse, hireResponse, topResponse, footerResponse] = await Promise.all([
        fetch("/components/navbar.html"),
        fetch("/pages/hire-top-talent.html"),
        fetch("/pages/top.html"),
        fetch("/components/footer.html"),
      ]);

      // Check for fetch errors
      if (!navbarResponse.ok || !hireResponse.ok || !topResponse.ok || !footerResponse.ok) {
        throw new Error("Failed to load resources");
      }

      const [navbarHtml, hireHtml, topHtml, footerHtml] = await Promise.all([
        navbarResponse.text(),
        hireResponse.text(),
        topResponse.text(),
        footerResponse.text(),
      ]);

      // Inject and cache content
      navbarPlaceholder.innerHTML = navbarHtml;
      localStorage.setItem("navbar-html", navbarHtml);
      hirePlaceholder.innerHTML = hireHtml;
      localStorage.setItem("hire-top-talent-html", hireHtml);
      topPlaceholder.innerHTML = topHtml;
      localStorage.setItem("top-talent-html", topHtml);
      footerPlaceholder.innerHTML = footerHtml;
      localStorage.setItem("footer-html", footerHtml);
    }

    // Initialize navbar interactions
    const hamburger = document.querySelector(".hamburger-menu");
    const navLinks = document.querySelector(".nav-links");
    const dropdown = document.querySelector(".dropdown");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (hamburger && navLinks) {
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        hamburger.setAttribute("aria-expanded", navLinks.classList.contains("active"));
      });

      // Close menu when clicking outside
      document.addEventListener("click", (event) => {
        if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
          navLinks.classList.remove("active");
          hamburger.setAttribute("aria-expanded", "false");
        }
      });

      // Keyboard support
      hamburger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navLinks.classList.toggle("active");
          hamburger.setAttribute("aria-expanded", navLinks.classList.contains("active"));
        }
      });
    }

    if (dropdown && dropdownMenu) {
      if (window.innerWidth >= 1024) {
        // Desktop: Hover-based dropdown
        dropdown.addEventListener("mouseenter", () => {
          dropdownMenu.style.display = "block";
          dropdown.setAttribute("aria-expanded", "true");
        });
        dropdown.addEventListener("mouseleave", () => {
          dropdownMenu.style.display = "none";
          dropdown.setAttribute("aria-expanded", "false");
        });
        dropdownMenu.addEventListener("mouseenter", () => {
          dropdownMenu.style.display = "block";
        });
        dropdownMenu.addEventListener("mouseleave", () => {
          dropdownMenu.style.display = "none";
          dropdown.setAttribute("aria-expanded", "false");
        });
      } else {
        // Mobile: Click-based dropdown
        dropdown.addEventListener("click", () => {
          const isOpen = dropdownMenu.style.display === "block";
          dropdownMenu.style.display = isOpen ? "none" : "block";
          dropdown.setAttribute("aria-expanded", !isOpen);
        });
      }

      // Keyboard support
      dropdown.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          const isOpen = dropdownMenu.style.display === "block";
          dropdownMenu.style.display = isOpen ? "none" : "block";
          dropdown.setAttribute("aria-expanded", !isOpen);
        }
      });
    }

    // Remove empty navBtn listeners (add functionality if needed)
    const navBtn = document.querySelectorAll(".nav-links ul li a");
    navBtn.forEach((nav) => {
      nav.addEventListener("click", (e) => {
        // Example: Close menu on link click
        navLinks.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  } catch (err) {
    console.error("Failed to load content:", err);
    if (navbarPlaceholder) navbarPlaceholder.innerHTML = "<p>Error loading navigation. Please refresh.</p>";
    if (hirePlaceholder) hirePlaceholder.innerHTML = "<p>Error loading content. Please refresh.</p>";
    if (topPlaceholder) topPlaceholder.innerHTML = "<p>Error loading content. Please refresh.</p>";
    if (footerPlaceholder) footerPlaceholder.innerHTML = "<p>Error loading footer. Please refresh.</p>";
  }
});
