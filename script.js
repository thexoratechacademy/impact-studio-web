document.addEventListener("DOMContentLoaded", () => {
    Promise.all([
        fetch("../pages/hire-top-talent.html").then(res => res.text()),
        fetch("../pages/top.html").then(res => res.text())
    ])
    .then(([hireTopTalentHtml, topHtml]) => {
        document.getElementById("hire-top-talent").innerHTML = 
            hireTopTalentHtml + topHtml; // or topHtml + hireTopTalentHtml
    })
    .catch(err => console.error("Failed to load content:", err));
});
