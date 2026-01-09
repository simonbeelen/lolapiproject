document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
    });
});

let currentChampionFilters = { role: '', sort: 'name', search: '' };

async function loadChampions() {
    try {
        const grid = document.getElementById('championsGrid');
        grid.innerHTML = '<p>Loading champions...</p>';
        grid.className = 'grid loading';

        const { role, sort, search } = currentChampionFilters;
        let url = `/api/champions?limit=200&sort=${sort}`;
        if (role) url += `&role=${role}`;
        if (search) url += `&search=${search}`;

        const response = await fetch(url);
        const data = await response.json();

        grid.className = 'grid';

        if (data.data.length === 0) {
            grid.innerHTML = '<p>No champions found.</p>';
            return;
        }

        grid.innerHTML = data.data.map(champion => `
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
                <div class="card-actions">
                    <button class="btn-edit" onclick="openEditModal('champion', ${champion.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteChampion(${champion.id})">Delete</button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading champions:', error);
        document.getElementById('championsGrid').innerHTML = '<p>Error loading champions.</p>';
    }
}

let currentItemFilters = { category: '', sort: 'name', search: '' };

async function loadItems() {
    try {
        const grid = document.getElementById('itemsGrid');
        grid.innerHTML = '<p>Loading items...</p>';
        grid.className = 'grid loading';

        const { category, sort, search } = currentItemFilters;
        let url = `/api/items?limit=200&sort=${sort}`;
        if (category) url += `&category=${category}`;
        if (search) url += `&search=${search}`;

        const response = await fetch(url);
        const data = await response.json();

        grid.className = 'grid';

        if (data.data.length === 0) {
            grid.innerHTML = '<p>No items found.</p>';
            return;
        }

        grid.innerHTML = data.data.map(item => `
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
                <div class="card-actions">
                    <button class="btn-edit" onclick="openEditModal('item', ${item.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteItem(${item.id})">Delete</button>
                </div>
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
        'Rabadon\'s Deathcap': '3089',
        'Thornmail': '3075',
        'Boots of Speed': '1001',
        'Health Potion': '2003',
        'Guardian Angel': '3026',
        'Trinity Force': '3078',
        'Zhonyas Hourglass': '3157',
        'Zhonya\'s Hourglass': '3157',
        'Blade of the Ruined King': '3153',
        'Dead Mans Plate': '3742'
    };
    return itemIds[itemName] || '3031';
}

document.getElementById('roleFilter').addEventListener('change', (e) => {
    currentChampionFilters.role = e.target.value;
    loadChampions();
});

document.getElementById('sortChampions').addEventListener('change', (e) => {
    currentChampionFilters.sort = e.target.value;
    loadChampions();
});

document.getElementById('searchChampions').addEventListener('input', (e) => {
    currentChampionFilters.search = e.target.value;
    loadChampions();
});

document.getElementById('categoryFilter').addEventListener('change', (e) => {
    currentItemFilters.category = e.target.value;
    loadItems();
});

document.getElementById('sortItems').addEventListener('change', (e) => {
    currentItemFilters.sort = e.target.value;
    loadItems();
});

document.getElementById('searchItems').addEventListener('input', (e) => {
    currentItemFilters.search = e.target.value;
    loadItems();
});

function openAddModal(type) {
    if (type === 'champion') {
        document.getElementById('championModalTitle').textContent = 'Add Champion';
        document.getElementById('championForm').reset();
        document.getElementById('championId').value = '';
        document.getElementById('championModal').style.display = 'block';
    } else {
        document.getElementById('itemModalTitle').textContent = 'Add Item';
        document.getElementById('itemForm').reset();
        document.getElementById('itemId').value = '';
        document.getElementById('itemModal').style.display = 'block';
    }
}

async function openEditModal(type, id) {
    if (type === 'champion') {
        try {
            const response = await fetch(`/api/champions/${id}`);
            const champion = await response.json();
            
            document.getElementById('championModalTitle').textContent = 'Edit Champion';
            document.getElementById('championId').value = champion.id;
            document.getElementById('championName').value = champion.name;
            document.getElementById('championTitle').value = champion.title;
            document.getElementById('championRole').value = champion.role;
            document.getElementById('championDifficulty').value = champion.difficulty;
            document.getElementById('championReleaseDate').value = champion.release_date;
            document.getElementById('championLore').value = champion.lore || '';
            
            document.getElementById('championModal').style.display = 'block';
        } catch (error) {
            alert('Error loading champion data: ' + error.message);
        }
    } else {
        try {
            const response = await fetch(`/api/items/${id}`);
            const item = await response.json();
            
            document.getElementById('itemModalTitle').textContent = 'Edit Item';
            document.getElementById('itemId').value = item.id;
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemDescription').value = item.description;
            document.getElementById('itemCost').value = item.cost;
            document.getElementById('itemCategory').value = item.category;
            document.getElementById('itemStats').value = item.stats || '';
            
            document.getElementById('itemModal').style.display = 'block';
        } catch (error) {
            alert('Error loading item data: ' + error.message);
        }
    }
}

function closeModal(type) {
    if (type === 'champion') {
        document.getElementById('championModal').style.display = 'none';
    } else {
        document.getElementById('itemModal').style.display = 'none';
    }
}

window.onclick = function(event) {
    const championModal = document.getElementById('championModal');
    const itemModal = document.getElementById('itemModal');
    if (event.target === championModal) {
        championModal.style.display = 'none';
    }
    if (event.target === itemModal) {
        itemModal.style.display = 'none';
    }
}

document.getElementById('championForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('championId').value;
    const data = {
        name: document.getElementById('championName').value,
        title: document.getElementById('championTitle').value,
        role: document.getElementById('championRole').value,
        difficulty: parseInt(document.getElementById('championDifficulty').value),
        release_date: document.getElementById('championReleaseDate').value,
        lore: document.getElementById('championLore').value
    };
    
    try {
        const url = id ? `/api/champions/${id}` : '/api/champions';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details ? error.details.join(', ') : error.error);
        }
        
        closeModal('champion');
        loadChampions();
        alert(id ? 'Champion updated!' : 'Champion added!');
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('itemId').value;
    const data = {
        name: document.getElementById('itemName').value,
        description: document.getElementById('itemDescription').value,
        cost: parseInt(document.getElementById('itemCost').value),
        category: document.getElementById('itemCategory').value,
        stats: document.getElementById('itemStats').value
    };
    
    try {
        const url = id ? `/api/items/${id}` : '/api/items';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details ? error.details.join(', ') : error.error);
        }
        
        closeModal('item');
        loadItems();
        alert(id ? 'Item updated!' : 'Item added!');
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

async function deleteChampion(id) {
    if (!confirm('Are you sure you want to delete this champion?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/champions/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete champion');
        }
        
        loadChampions();
        alert('Champion deleted!');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/items/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete item');
        }
        
        loadItems();
        alert('Item deleted!');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

loadChampions();
loadItems();