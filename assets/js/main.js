// Inject the footer component into the homepage(index.html). This is just an example
document.addEventListener("DOMContentLoaded", () => {
  fetch("components/footer.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("footer-placeholder").innerHTML = html;
    })
    .catch((err) => console.error("Failed to load footer:", err));
});
