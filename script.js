// Smooth scroll to leaks
function scrollToLeaks() {
    document.getElementById("leaks-container").scrollIntoView({ behavior: "smooth" });
}

// Show admin panel
function showAdmin() {
    const panel = document.getElementById("admin-form");
    const pass = prompt("Enter password:");
    if (pass === "GasOnly") {
        panel.style.display = "flex";
    } else {
        alert("Incorrect password.");
    }
}

// Supabase connection
const SUPABASE_URL = "https://iddpdcgekjcwqzhauguz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZHBkY2dla2pjd3F6aGF1Z3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDQ5NjEsImV4cCI6MjA2MDYyMDk2MX0.rO5Dm0PV_Awuww_nUtvQBFgjQb4L-pry7KWmzqKSjnw";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Load leaks
async function loadLeaks() {
    const { data, error } = await supabase.from("link_url").select("*");
    if (data) {
        const container = document.getElementById("leaks-container");
        container.innerHTML = "";
        data.forEach(leak => {
            const card = document.createElement("div");
            card.className = "leak-card";
            card.innerHTML = `
        <h3>${leak.name}</h3>
        <img src="${leak.image_url}" alt="${leak.name}">
        <a href="${leak.link}" target="_blank">Visit Script</a>
      `;
            container.appendChild(card);
        });
    }
}

loadLeaks();

// Add leak
async function submitLeak() {
    const name = document.getElementById("leak-name").value;
    const image_url = document.getElementById("image-url").value;
    const link = document.getElementById("leak-link").value;

    const { error } = await supabase.from("link_url").insert([{ name, image_url, link }]);
    if (error) {
        alert("Failed to add leak");
    } else {
        alert("Leak added!");
        loadLeaks();
    }
}

// RED PARTICLES BACKGROUND
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < 100; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});
