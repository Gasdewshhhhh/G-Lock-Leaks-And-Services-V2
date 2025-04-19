import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://iddpdcgekjcwqzhauguz.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY_HERE'; // Replace with your actual key
const supabase = createClient(supabaseUrl, supabaseKey);

window.supabase = supabase;

// Check if user has 'owner' role and show admin panel
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
