// Fetch and display champions
async function loadChampions(role = '', sort = 'name') {
    try {
        const championsGrid = document.getElementById('championsGrid');
        championsGrid.innerHTML = '<p>Loading champions...</p>';
        championsGrid.className = 'grid loading';

        let url = `/api/champions?limit=100&sort=${sort}`;
        if (role) url += `&role=${role}`;

        const response = await fetch(url);
        const data = await response.json();

        championsGrid.className = 'grid';

        if (data.data.length === 0) {
            championsGrid.innerHTML = '<p>No champions found.</p>';
            return;
        }

        championsGrid.innerHTML = data.data.map(champion => `
            <div class="champion-card">
                <img 
                    src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.name}_0.jpg" 
                    alt="${champion.name}"
                    class="champion-image"
                    onerror="this.src='https://via.placeholder.com/280x200/1e2328/c89b3c?text=${champion.name}'"
                >
                <div class="champion-name">${champion.name}</div>
                <div class="champion-title">${champion.title}</div>
                <div class="champion-details">
                    <div class="detail-row">
                        <span class="detail-label">Role:</span>
                        <span class="role-badge role-${champion.role}">${champion.role}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Difficulty:</span>
                        <span class="detail-value">${champion.difficulty}/10</span>
                    </div>
                    <div class="difficulty-bar">
                        <div class="difficulty-fill" style="width: ${champion.difficulty * 10}%"></div>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Release:</span>
                        <span class="detail-value">${new Date(champion.release_date).toLocaleDateString('nl-NL')}</span>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading champions:', error);
        document.getElementById('championsGrid').innerHTML = '<p>Error loading champions.</p>';
    }
}

async function loadItems(category = '', sort = 'name') {
    try {
        const itemsGrid = document.getElementById('itemsGrid');
        itemsGrid.innerHTML = '<p>Loading items...</p>';
        itemsGrid.className = 'grid loading';

        let url = `/api/items?limit=100&sort=${sort}`;
        if (category) url += `&category=${category}`;

        const response = await fetch(url);
        const data = await response.json();

        itemsGrid.className = 'grid';

        if (data.data.length === 0) {
            itemsGrid.innerHTML = '<p>No items found.</p>';
            return;
        }

        itemsGrid.innerHTML = data.data.map(item => `
            <div class="item-card">
                <img 
                    src="https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${getItemId(item.name)}.png" 
                    alt="${item.name}"
                    class="item-image"
                    onerror="this.src='https://via.placeholder.com/280x200/1e2328/c89b3c?text=${encodeURIComponent(item.name)}'"
                >
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-details">
                    <div class="detail-row">
                        <span class="detail-label">Cost:</span>
                        <span class="cost-value">${item.cost}g</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Category:</span>
                        <span class="category-badge category-${item.category}">${item.category}</span>
                    </div>
                </div>
                ${item.stats ? `<div class="item-stats">${item.stats}</div>` : ''}
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading items:', error);
        document.getElementById('itemsGrid').innerHTML = '<p>Error loading items.</p>';
    }
}

function getItemId(itemName) {
    const itemIds = {
        'Infinity Edge': '3031',
        'Rabadons Deathcap': '3089',
        'Thornmail': '3075',
        'Boots of Speed': '1001',
        'Health Potion': '2003',
        'Guardian Angel': '3026',
        'Trinity Force': '3078',
        'Zhonyas Hourglass': '3157',
        'Blade of the Ruined King': '3153',
        'Dead Mans Plate': '3742'
    };
    return itemIds[itemName] || '3031';
}

document.getElementById('roleFilter').addEventListener('change', (e) => {
    const sort = document.getElementById('sortChampions').value;
    loadChampions(e.target.value, sort);
});

document.getElementById('sortChampions').addEventListener('change', (e) => {
    const role = document.getElementById('roleFilter').value;
    loadChampions(role, e.target.value);
});

document.getElementById('categoryFilter').addEventListener('change', (e) => {
    const sort = document.getElementById('sortItems').value;
    loadItems(e.target.value, sort);
});

document.getElementById('sortItems').addEventListener('change', (e) => {
    const category = document.getElementById('categoryFilter').value;
    loadItems(category, e.target.value);
});

loadChampions();
loadItems();