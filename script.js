// ✅ SUPABASE CONFIG FIRST
const SUPABASE_URL = 'https://iddpdcgekjcwqzhauguz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZHBkY2dla2pjd3F6aGF1Z3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDQ5NjEsImV4cCI6MjA2MDYyMDk2MX0.rO5Dm0PV_Awuww_nUtvQBFgjQb4L-pry7KWmzqKSjnw'; // replace with your actual key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ DOM references
const leaksGrid = document.querySelector('.leaks-grid');
const adminDot = document.querySelector('.dot-admin');
const adminPanel = document.querySelector('.admin-panel');
const passwordPrompt = 'GasOnly';
const scrollBtn = document.querySelector('.browse-button');

// ✅ Scroll to leaks
scrollBtn.addEventListener('click', () => {
    document.querySelector('.leaks-grid').scrollIntoView({ behavior: 'smooth' });
});

// ✅ Show/hide admin panel with password
adminDot.addEventListener('click', () => {
    const pass = prompt('Enter password:');
    if (pass === passwordPrompt) {
        adminPanel.style.display = adminPanel.style.display === 'flex' ? 'none' : 'flex';
    } else {
        alert('Incorrect password');
    }
});

// ✅ Add leak
document.getElementById('addLeak').addEventListener('click', async () => {
    const name = document.getElementById('leakName').value;
    const imageUrl = document.getElementById('leakImage').value;
    const link = document.getElementById('leakLink').value;

    if (!name || !imageUrl || !link) return alert('Please fill in all fields');

    const { error } = await supabase.from('leaks').insert([{ name, image_url: imageUrl, link }]);
    if (error) {
        alert('Failed to add leak');
        console.error(error);
    } else {
        loadLeaks();
    }
});

// ✅ Load leaks from Supabase
async function loadLeaks() {
    const { data, error } = await supabase.from('leaks').select('*').order('id', { ascending: false });
    if (error) {
        console.error('Error fetching leaks:', error);
        return;
    }

    leaksGrid.innerHTML = '';
    data.forEach(leak => {
        const card = document.createElement('div');
        card.className = 'leak-card';

        card.innerHTML = `
      <h3>${leak.name}</h3>
      <img src="${leak.image_url}" alt="${leak.name}">
      <a href="${leak.link}" target="_blank">Visit Script</a>
    `;

        leaksGrid.appendChild(card);
    });
}

// ✅ Initial load
loadLeaks();
