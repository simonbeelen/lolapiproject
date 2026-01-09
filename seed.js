const db = require('./src/database');
const https = require('https');

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}


function mapChampionRole(tags) {
    const roleMap = {
        'Tank': 'Tank',
        'Fighter': 'Fighter',
        'Assassin': 'Assassin',
        'Mage': 'Mage',
        'Marksman': 'Marksman',
        'Support': 'Support'
    };
    
    return roleMap[tags[0]] || 'Fighter'; //
}

function mapItemCategory(tags) {
    if (!tags || tags.length === 0) return 'Consumable';
    

    if (tags.includes('Damage') || tags.includes('CriticalStrike') || tags.includes('AttackSpeed')) {
        return 'Damage';
    }
    if (tags.includes('Armor') || tags.includes('Health') || tags.includes('HealthRegen')) {
        return 'Defense';
    }
    if (tags.includes('SpellDamage') || tags.includes('Mana') || tags.includes('ManaRegen')) {
        return 'Magic';
    }
    if (tags.includes('Boots') || tags.includes('NonbootsMovement')) {
        return 'Movement';
    }
    if (tags.includes('Consumable')) {
        return 'Consumable';
    }
    
    return 'Damage'; 
}

function formatItemStats(stats) {
    const parts = [];
    if (stats.FlatPhysicalDamageMod) parts.push(`+${stats.FlatPhysicalDamageMod} Attack Damage`);
    if (stats.FlatMagicDamageMod) parts.push(`+${stats.FlatMagicDamageMod} Ability Power`);
    if (stats.FlatHPPoolMod) parts.push(`+${stats.FlatHPPoolMod} Health`);
    if (stats.FlatArmorMod) parts.push(`+${stats.FlatArmorMod} Armor`);
    if (stats.FlatSpellBlockMod) parts.push(`+${stats.FlatSpellBlockMod} Magic Resist`);
    if (stats.PercentAttackSpeedMod) parts.push(`+${(stats.PercentAttackSpeedMod * 100).toFixed(0)}% Attack Speed`);
    if (stats.PercentMovementSpeedMod) parts.push(`+${(stats.PercentMovementSpeedMod * 100).toFixed(0)}% Movement Speed`);
    
    return parts.length > 0 ? parts.join(', ') : 'Various stats';
}

async function seedDatabase() {
    try {
        console.log('Starting Data Dragon seed...\n');
        
        console.log('Fetching latest Data Dragon version...');
        const versions = await fetchJSON('https://ddragon.leagueoflegends.com/api/versions.json');
        const latestVersion = versions[0];
        console.log(`✓ Latest version: ${latestVersion}\n`);
        
        console.log('  Fetching all champions...');
        const championsData = await fetchJSON(
            `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
        );
        
        const champions = Object.values(championsData.data);
        console.log(`✓ Found ${champions.length} champions\n`);
     
        console.log('  Fetching all items...');
        const itemsData = await fetchJSON(
            `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`
        );
        
        const items = Object.entries(itemsData.data)
            .filter(([id, item]) => {
                // Filter uit items zonder naam, zonder gold, zonder image
                return item.name && 
                       item.image &&
                       item.image.full &&
                       !item.name.includes('Quick Charge') && 
                       !item.name.includes('Enchantment') &&
                       !item.name.includes('Turret') &&
                       item.gold && 
                       item.gold.total > 0 &&
                       !item.requiredChampion; 
            })
            .map(([id, item]) => ({ id, ...item }));
        
        console.log(` Found ${items.length} items (filtered)\n`);
        
        console.log('Adding champions to database...');
        let championCount = 0;
        
        for (const champion of champions) {
            try {
                const releaseDate = '2009-01-01'; 
                
                const role = mapChampionRole(champion.tags);
                const difficulty = Math.min(10, Math.max(1, Math.round(champion.info.difficulty)));
                const lore = champion.blurb || `${champion.name}, ${champion.title}`;
                
                // Build the image URL from Data Dragon
                const imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;
                
                await new Promise((resolve, reject) => {
                    db.run(
                        `INSERT INTO champions (name, title, role, difficulty, release_date, lore, image_url) 
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [champion.name, champion.title, role, difficulty, releaseDate, lore, imageUrl],
                        function(err) {
                            if (err) {

                                if (err.message.includes('UNIQUE')) {
                                    resolve();
                                } else {
                                    reject(err);
                                }
                            } else {
                                championCount++;
                                process.stdout.write(`\r✓ Added ${championCount}/${champions.length} champions`);
                                resolve();
                            }
                        }
                    );
                });
            } catch (err) {
                console.error(`\nError adding ${champion.name}:`, err.message);
            }
        }
        
        console.log('\n');
    
        console.log('Adding items to database...');
        let itemCount = 0;

        const itemsToAdd = items.slice(0, 50);
        
        for (const item of itemsToAdd) {
            try {
                const category = mapItemCategory(item.tags);
                const cost = item.gold.total;
                
                const description = item.plaintext || 
                                   item.description.replace(/<[^>]*>/g, '').substring(0, 200);
                
                const stats = item.stats ? formatItemStats(item.stats) : '';
                
                // Build the image URL from Data Dragon
                const imageUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/item/${item.image.full}`;
                
                await new Promise((resolve, reject) => {
                    db.run(
                        `INSERT INTO items (name, description, cost, category, stats, image_url) 
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [item.name, description, cost, category, stats, imageUrl],
                        function(err) {
                            if (err) {
                                // Skip duplicates
                                if (err.message.includes('UNIQUE')) {
                                    resolve();
                                } else {
                                    reject(err);
                                }
                            } else {
                                itemCount++;
                                process.stdout.write(`\r✓ Added ${itemCount}/${itemsToAdd.length} items`);
                                resolve();
                            }
                        }
                    );
                });
            } catch (err) {
                console.error(`\nError adding ${item.name}:`, err.message);
            }
        }
        
        console.log('\n');
        console.log(`\n✅ Database seeding complete!`);
        console.log(`   Champions: ${championCount} added`);
        console.log(`   Items: ${itemCount} added`);
        console.log(`\n🎮 Total: ${championCount + itemCount} entries\n`);
        
    } catch (error) {
        console.error('❌ Error during seeding:', error);
    } finally {
    
        setTimeout(() => {
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                } else {
                    console.log('Database connection closed.');
                }
                process.exit(0);
            });
        }, 1000);
    }
}

seedDatabase();