async function addCard() {
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
}

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
