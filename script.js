import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase setup
const supabaseUrl = 'https://iddpdcgekjcwqzhauguz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZHBkY2dla2pjd3F6aGF1Z3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDQ5NjEsImV4cCI6MjA2MDYyMDk2MX0.rO5Dm0PV_Awuww_nUtvQBFgjQb4L-pry7KWmzqKSjnw'; // Replace with your anon/public key
const supabase = createClient(supabaseUrl, supabaseKey);
window.supabase = supabase;

// Function to render a card
function renderCard(leak) {
    const card = document.createElement("div");
    card.className = "card bg-red-800 p-4 rounded-xl shadow-lg card-added transition-transform transform hover:scale-105";
    card.innerHTML = `
        <h2 class="text-xl font-semibold text-white mb-2">${leak.name}</h2>
        <img src="${leak.image_url}" alt="${leak.name}" class="rounded-lg mb-4 w-full h-48 object-cover" />
        <a href="${leak.link_url}" target="_blank" class="block text-center text-red-300 hover:underline">Visit Script</a>
    `;
    document.getElementById("content").appendChild(card);
}

// Load all cards
async function loadCards() {
    const { data: leaks, error } = await supabase.from('leaks').select('*');
    if (error) {
        console.error("Error loading leaks:", error);
        return;
    }
    leaks.forEach(renderCard);
}

// Add card (admin only)
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

// Check current user and their role
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

// Optional: check login on page load
supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
        checkAdminAccess();
    }
});

// Trigger login form
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    loginBtn.addEventListener('click', async () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            alert("Login failed.");
            console.error(error);
        } else {
            alert("Logged in successfully!");
            document.getElementById('loginModal').classList.add('hidden');
            checkAdminAccess();
        }
    });

    loadCards(); // Load all leaks after DOM is ready
});
