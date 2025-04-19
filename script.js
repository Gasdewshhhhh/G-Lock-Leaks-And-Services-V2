import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase setup
const supabase = createClient(
    'https://iddpdcgekjcwqzhauguz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZHBkY2dla2pjd3F6aGF1Z3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDQ5NjEsImV4cCI6MjA2MDYyMDk2MX0.rO5Dm0PV_Awuww_nUtvQBFgjQb4L-pry7KWmzqKSjnw'
);

// Check role & show admin if owner
async function checkAdminAccess() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error("Error fetching role:", error);
        return;
    }

    if (profile.role === 'owner') {
        document.getElementById('adminForm').classList.remove('hidden');
    }
}

// Add card
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

// Show cards
function renderCard(leak) {
    const card = document.createElement("div");
    card.className = "card bg-red-700 p-4 rounded-xl shadow-lg card-added transition-transform transform hover:scale-105";
    card.innerHTML = `
    <h2 class="text-xl font-semibold text-white mb-2">${leak.name}</h2>
    <img src="${leak.image_url}" alt="${leak.name}" class="rounded-lg mb-4 w-full h-48 object-cover" />
    <a href="${leak.link_url}" target="_blank" class="block text-center text-red-200 hover:underline">Visit Script</a>
  `;
    document.getElementById("content").appendChild(card);
}

// Load cards
async function loadCards() {
    const { data: leaks, error } = await supabase.from('leaks').select('*');
    if (error) {
        console.error("Error loading leaks:", error);
        return;
    }
    leaks.forEach(renderCard);
}

loadCards();
