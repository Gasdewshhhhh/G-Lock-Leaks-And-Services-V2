import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://iddpdcgekjcwqzhauguz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZHBkY2dla2pjd3F6aGF1Z3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDQ5NjEsImV4cCI6MjA2MDYyMDk2MX0.rO5Dm0PV_Awuww_nUtvQBFgjQb4L-pry7KWmzqKSjnw'; // your full key
const supabase = createClient(supabaseUrl, supabaseKey);
window.supabase = supabase;

const password = "GasOnly";

window.promptAdmin = function () {
    const input = prompt("Enter admin password:");
    if (input === password) {
        document.getElementById('adminForm').classList.remove("hidden");
    } else {
        alert("Incorrect password.");
    }
};

window.addCard = async function () {
    const name = document.getElementById("name").value;
    const imgUrl = document.getElementById("imgUrl").value;
    const linkUrl = document.getElementById("linkUrl").value;

    if (!name || !imgUrl || !linkUrl) {
        alert("Please fill in all fields.");
        return;
    }

    const { error } = await supabase.from('leaks').insert([{ name, image_url: imgUrl, link_url: linkUrl }]);
    if (error) {
        alert("Error adding card.");
        return;
    }

    document.getElementById("adminForm").classList.add("hidden");
    renderCard({ name, image_url: imgUrl, link_url: linkUrl });
};

function renderCard(leak) {
    const card = document.createElement("div");
    card.className = "card bg-red-900 p-4 shadow-lg";
    card.innerHTML = `
    <h2 class="text-xl font-semibold text-white mb-2">${leak.name}</h2>
    <img src="${leak.image_url}" alt="${leak.name}" class="rounded-lg mb-4 w-full h-48 object-cover" />
    <a href="${leak.link_url}" target="_blank" class="block text-center text-red-400 hover:text-red-300">Visit Script</a>
  `;
    document.getElementById("content").appendChild(card);
}

async function loadCards() {
    const { data: leaks } = await supabase.from('leaks').select('*');
    leaks.forEach(renderCard);
}

function scrollToLeaks() {
    document.getElementById('leaks').scrollIntoView({ behavior: 'smooth' });
}
window.scrollToLeaks = scrollToLeaks;

loadCards();
