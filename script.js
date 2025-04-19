import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase setup
const supabaseUrl = 'https://iddpdcgekjcwqzhauguz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZHBkY2dla2pjd3F6aGF1Z3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDQ5NjEsImV4cCI6MjA2MDYyMDk2MX0.rO5Dm0PV_Awuww_nUtvQBFgjQb4L-pry7KWmzqKSjnw'; // your full key
const supabase = createClient(supabaseUrl, supabaseKey);
window.supabase = supabase;

const adminEmail = "Mapervez72@gmail.com";

// Auth UI elements
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

// Handle login
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert("Login failed: " + error.message);
    } else {
        loginModal.classList.add("hidden");
        checkAdminAccess();
    }
});

// Check session and admin status
async function checkAdminAccess() {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        const email = session.user.email;
        if (email === adminEmail) {
            document.getElementById("adminBtn").classList.remove("hidden");
            logoutBtn.classList.remove("hidden");
        }
    }
}

// Logout
logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    document.getElementById("adminForm").classList.add("hidden");
    logoutBtn.classList.add("hidden");
    alert("Logged out.");
});

// Show admin panel
window.promptAdmin = function () {
    document.getElementById("adminForm").classList.remove("hidden");
};

// Add a leak card
window.addCard = async function () {
    const name = document.getElementById("name").value;
    const imgUrl = document.getElementById("imgUrl").value;
    const linkUrl = document.getElementById("linkUrl").value;

    if (!name || !imgUrl || !linkUrl) {
        alert("Please fill in all fields");
        return;
    }

    const { error } = await supabase.from('leaks').insert([
        { name, image_url: imgUrl, link_url: linkUrl }
    ]);

    if (error) {
        console.error("Error inserting:", error);
        alert("Failed to add card.");
        return;
    }

    document.getElementById("adminForm").classList.add("hidden");
    renderCard({ name, image_url: imgUrl, link_url: linkUrl });
};

// Render a leak card
function renderCard(leak) {
    const card = document.createElement("div");
    card.className = "card bg-red-800 p-4 rounded-xl shadow-lg card-added transition-transform transform hover:scale-105";
    card.innerHTML = `
        <h2 class="text-xl font-semibold text-white mb-2">${leak.name}</h2>
        <img src="${leak.image_url}" alt="${leak.name}" class="rounded-lg mb-4 w-full h-48 object-cover" />
        <a href="${leak.link_url}" target="_blank" class="block text-center text-white hover:underline">Visit Script</a>
    `;
    document.getElementById("content").appendChild(card);
}

// Load all leak cards
async function loadCards() {
    const { data: leaks, error } = await supabase.from('leaks').select('*');
    if (error) {
        console.error("Error loading leaks:", error);
        return;
    }
    leaks.forEach(renderCard);
}

loadCards();
checkAdminAccess();
