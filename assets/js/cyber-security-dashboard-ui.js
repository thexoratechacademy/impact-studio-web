// Cybersecurity Learning Dashboard - UI Components & Initialization

document.addEventListener('DOMContentLoaded', () => {
  const overlay    = document.getElementById("sidebarOverlay");
  const sidebar    = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");

  /* ── Measure real Navbar height and set CSS variable ── */
  function syncNavbarHeight() {
    const header = document.querySelector("header");
    if (header) {
      const h = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--navbar-h", h + "px");
    }
  }

  /* ── Navbar injection ── */
  fetch("../components/navbar.html")
    .then((r) => r.text())
    .then((html) => {
      document.getElementById("navbar-placeholder").innerHTML = html;

      requestAnimationFrame(() => {
        syncNavbarHeight();
        window.addEventListener("resize", syncNavbarHeight);
      });

      const hamburger    = document.querySelector(".hamburger-menu");
      const navLinks     = document.querySelector(".nav-links");
      const dropdown     = document.querySelector(".dropdown");
      const dropdownMenu = document.querySelector(".dropdown-menu");

      if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => navLinks.classList.add("active"));
        document.addEventListener("click", (e) => {
          if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove("active");
          }
        });
      }

      if (dropdown && dropdownMenu) {
        if (window.innerWidth >= 1024) {
          dropdown.addEventListener("mouseenter",     () => { dropdownMenu.style.display = "block"; });
          dropdown.addEventListener("mouseleave",     () => { dropdownMenu.style.display = "none";  });
          dropdownMenu.addEventListener("mouseenter", () => { dropdownMenu.style.display = "block"; });
          dropdownMenu.addEventListener("mouseleave", () => { dropdownMenu.style.display = "none";  });
        } else {
          dropdown.addEventListener("click", () => {
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
          });
        }
      }
    })
    .catch((err) => console.error("Failed to load navbar:", err));

  /* ── Footer injection ── */
  fetch("../components/footer.html")
    .then((r) => r.text())
    .then((html) => {
      document.getElementById("footer-placeholder").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));

  /* ── Mobile sidebar overlay ── */
  if (overlay && sidebar) {
    // Close sidebar when clicking overlay
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("visible");
    });
  }

  if (menuToggle && sidebar && overlay) {
    menuToggle.addEventListener("click", () => {
      const isOpen = sidebar.classList.contains("open");
      
      if (isOpen) {
        // Close sidebar
        sidebar.classList.remove("open");
        overlay.classList.remove("visible");
      } else {
        // Open sidebar
        sidebar.classList.add("open");
        overlay.classList.add("visible");
      }
    });
  }
  
  // Handle window resize - reset sidebar state on desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1023) {
      sidebar.classList.remove("open");
      overlay.classList.remove("visible");
    }
  });
});
