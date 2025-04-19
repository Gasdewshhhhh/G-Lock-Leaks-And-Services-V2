import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://iddpdcgekjcwqzhauguz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZHBkY2dla2pjd3F6aGF1Z3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDQ5NjEsImV4cCI6MjA2MDYyMDk2MX0.rO5Dm0PV_Awuww_nUtvQBFgjQb4L-pry7KWmzqKSjnw';
const supabase = createClient(supabaseUrl, supabaseKey);
window.supabase = supabase;

const ADMIN_PASSWORD = "GasOnly";

function checkLogin() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
        document.getElementById("adminForm").classList.remove("hidden");
        document.getElementById("loginModal").classList.add("hidden");
        document.getElementById("logoutBtn").classList.remove("hidden");
    }
}

window.handleLogin = function () {
    const inputPassword = document.getElementById("loginPassword").value;
    if (inputPassword === ADMIN_PASSWORD) {
        sessionStorage.setItem("isLoggedIn", "true");
        checkLogin();
    } else {
        alert("Incorrect password");
    }
};

window.logout = function () {
    sessionStorage.removeItem("isLoggedIn");
    document.getElementById("adminForm").classList.add("hidden");
    document.getElementById("loginModal").classList.remove("hidden");
    document.getElementById("logoutBtn").classList.add("hidden");
};

window.addCard = async function () {
    const name = document.getElementById("name").value;
    const imgUrl = document.getElementById("imgUrl").value;
    const linkUrl = document.getElementById("linkUrl").value;

    if (!name || !imgUrl || !linkUrl) {
        alert("Please fill in all fields");
        return;
    }

    const { data, error } = await supabase.from('leaks').insert([
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

function renderCard(leak) {
    const card = document.createElement("div");
    card.className = "card bg-gray-800 p-4 rounded-xl shadow-lg card-added transition-transform transform hover:scale-105";
    card.innerHTML = `
        <h2 class="text-xl font-semibold text-red-400 mb-2">${leak.name}</h2>
        <img src="${leak.image_url}" alt="${leak.name}" class="rounded-lg mb-4 w-full h-48 object-cover" />
        <a href="${leak.link_url}" target="_blank" class="block text-center text-red-500 hover:underline">Visit Script</a>
    `;
    document.getElementById("content").appendChild(card);
}

async function loadCards() {
    const { data: leaks, error } = await supabase.from('leaks').select('*');
    if (error) {
        console.error("Error loading leaks:", error);
        return;
    }
    leaks.forEach(renderCard);
}

checkLogin();
loadCards();
