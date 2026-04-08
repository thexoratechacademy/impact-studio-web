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

//-----Backend connection -----
async function submitThexoraForm(formData) {
    const API_URL = window.location.hostname === 'localhost'
  ? "http://localhost:5000/api/submit"
  : "https://impact-studio-web.onrender.com/api/submit";

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.success) {
            alert("Success! Form verified and sumitted.");
            window.location.reload(); // Refresh after success
        } else {
            // show the first validation error message from zod
            alert("Error: " + data.errors[0].message);
        } 
    } catch (error) {
        console.error("Submit Error:", error);
        alert("Server connection failed.");
    }
}