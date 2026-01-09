const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'lol.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(' Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log(' Connected to the database');
});

const champions = [
  {
    name: 'Ahri',
    title: 'the Nine-Tailed Fox',
    role: 'Mage',
    difficulty: 5,
    release_date: '2011-12-14',
    lore: 'Innately connected to the latent power of Runeterra, Ahri is a vastaya who can reshape magic into orbs of raw energy.'
  },
  {
    name: 'Yasuo',
    title: 'the Unforgiven',
    role: 'Fighter',
    difficulty: 10,
    release_date: '2013-12-13',
    lore: 'An Ionian of deep resolve, Yasuo is an agile swordsman who wields the air itself against his enemies.'
  },
  {
    name: 'Jinx',
    title: 'the Loose Cannon',
    role: 'Marksman',
    difficulty: 6,
    release_date: '2013-10-10',
    lore: 'A manic and impulsive criminal from Zaun, Jinx lives to wreak havoc without care for the consequences.'
  },
  {
    name: 'Thresh',
    title: 'the Chain Warden',
    role: 'Support',
    difficulty: 7,
    release_date: '2013-01-23',
    lore: 'Sadistic and cunning, Thresh is an ambitious and restless spirit of the Shadow Isles.'
  },
  {
    name: 'Lee Sin',
    title: 'the Blind Monk',
    role: 'Fighter',
    difficulty: 6,
    release_date: '2011-04-01',
    lore: 'A master of Ionia\'s ancient martial arts, Lee Sin is a principled fighter who channels the essence of the dragon spirit.'
  },
  {
    name: 'Lux',
    title: 'the Lady of Luminosity',
    role: 'Mage',
    difficulty: 5,
    release_date: '2010-10-19',
    lore: 'Luxanna Crownguard hails from Demacia, an insular realm where magical abilities are viewed with fear and suspicion.'
  },
  {
    name: 'Zed',
    title: 'the Master of Shadows',
    role: 'Assassin',
    difficulty: 7,
    release_date: '2012-11-13',
    lore: 'Utterly ruthless and without mercy, Zed is the leader of the Order of Shadow, an organization he created with the intent of militarizing Ionia\'s magical and martial traditions.'
  },
  {
    name: 'Ezreal',
    title: 'the Prodigal Explorer',
    role: 'Marksman',
    difficulty: 7,
    release_date: '2010-03-16',
    lore: 'A dashing adventurer, unknowingly gifted in the magical arts, Ezreal raids long-lost catacombs, tangles with ancient curses, and overcomes seemingly impossible odds with ease.'
  },
  {
    name: 'Vayne',
    title: 'the Night Hunter',
    role: 'Marksman',
    difficulty: 8,
    release_date: '2011-05-10',
    lore: 'Shauna Vayne is a deadly, remorseless Demacian monster hunter, who has dedicated her life to finding and destroying the demon that murdered her family.'
  },
  {
    name: 'Blitzcrank',
    title: 'the Great Steam Golem',
    role: 'Tank',
    difficulty: 4,
    release_date: '2009-09-02',
    lore: 'Blitzcrank is an enormous, near-indestructible automaton from Zaun who devoted himself to helping others.'
  }
];

const items = [
  {
    name: 'Infinity Edge',
    description: 'Massively enhances critical strike damage',
    cost: 3400,
    category: 'Critical',
    stats: JSON.stringify({ attack_damage: 70, critical_strike_chance: 20 })
  },
  {
    name: 'Rabadon\'s Deathcap',
    description: 'Increases ability power by 40%',
    cost: 3600,
    category: 'Magic',
    stats: JSON.stringify({ ability_power: 120 })
  },
  {
    name: 'Guardian Angel',
    description: 'Revives champion upon death',
    cost: 3200,
    category: 'Defense',
    stats: JSON.stringify({ attack_damage: 45, armor: 40 })
  },
  {
    name: 'Trinity Force',
    description: 'Tons of damage',
    cost: 3333,
    category: 'Mixed',
    stats: JSON.stringify({ attack_damage: 40, attack_speed: 30, health: 250, ability_haste: 20 })
  },
  {
    name: 'Thornmail',
    description: 'Reflects damage to attackers',
    cost: 2700,
    category: 'Defense',
    stats: JSON.stringify({ armor: 80, health: 350 })
  },
  {
    name: 'Liandry\'s Torment',
    description: 'Burns enemies based on their max health',
    cost: 3200,
    category: 'Magic',
    stats: JSON.stringify({ ability_power: 90, ability_haste: 25, health: 300 })
  },
  {
    name: 'Blade of the Ruined King',
    description: 'Deals percent current health damage',
    cost: 3200,
    category: 'Critical',
    stats: JSON.stringify({ attack_damage: 40, attack_speed: 30, life_steal: 10 })
  },
  {
    name: 'Dead Man\'s Plate',
    description: 'Grants movement speed that builds up over time',
    cost: 2900,
    category: 'Defense',
    stats: JSON.stringify({ health: 300, armor: 45, movement_speed: 5 })
  },
  {
    name: 'Luden\'s Tempest',
    description: 'Summons bolts of lightning on spell hit',
    cost: 3200,
    category: 'Magic',
    stats: JSON.stringify({ ability_power: 100, magic_penetration: 15, ability_haste: 20 })
  },
  {
    name: 'Mortal Reminder',
    description: 'Inflicts Grievous Wounds on enemies',
    cost: 2500,
    category: 'Critical',
    stats: JSON.stringify({ attack_damage: 30, critical_strike_chance: 20, armor_penetration: 30 })
  },
  {
    name: 'Zhonya\'s Hourglass',
    description: 'Makes champion invulnerable and untargetable',
    cost: 3250,
    category: 'Magic',
    stats: JSON.stringify({ ability_power: 100, armor: 45, ability_haste: 15 })
  },
  {
    name: 'Sunfire Aegis',
    description: 'Immolates nearby enemies',
    cost: 2700,
    category: 'Defense',
    stats: JSON.stringify({ health: 450, armor: 50, ability_haste: 10 })
  }
];

function clearTables() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DELETE FROM champions', (err) => {
        if (err) {
          console.error('❌ Error clearing champions table:', err.message);
          reject(err);
        } else {
          console.log('🗑️  Cleared champions table');
        }
      });

      db.run('DELETE FROM items', (err) => {
        if (err) {
          console.error('❌ Error clearing items table:', err.message);
          reject(err);
        } else {
          console.log('🗑️  Cleared items table');
          resolve();
        }
      });
    });
  });
}

function seedChampions() {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      'INSERT INTO champions (name, title, role, difficulty, release_date, lore) VALUES (?, ?, ?, ?, ?, ?)'
    );

    let completed = 0;
    champions.forEach((champion, index) => {
      stmt.run(
        champion.name,
        champion.title,
        champion.role,
        champion.difficulty,
        champion.release_date,
        champion.lore,
        (err) => {
          if (err) {
            console.error(`❌ Error inserting ${champion.name}:`, err.message);
            reject(err);
          } else {
            console.log(`✅ Added champion: ${champion.name}`);
            completed++;
            if (completed === champions.length) {
              stmt.finalize();
              resolve();
            }
          }
        }
      );
    });
  });
}

function seedItems() {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      'INSERT INTO items (name, description, cost, category, stats) VALUES (?, ?, ?, ?, ?)'
    );

    let completed = 0;
    items.forEach((item, index) => {
      stmt.run(
        item.name,
        item.description,
        item.cost,
        item.category,
        item.stats,
        (err) => {
          if (err) {
            console.error(`❌ Error inserting ${item.name}:`, err.message);
            reject(err);
          } else {
            console.log(`✅ Added item: ${item.name}`);
            completed++;
            if (completed === items.length) {
              stmt.finalize();
              resolve();
            }
          }
        }
      );
    });
  });
}

async function seed() {
  try {
    console.log('🌱 Starting database seeding...\n');

    await clearTables();
    console.log('');

    await seedChampions();
    console.log('');

    await seedItems();
    console.log('');

    console.log(' Database seeding completed successfully!');
    console.log(` Added ${champions.length} champions and ${items.length} items`);
  } catch (error) {
    console.error(' Seeding failed:', error.message);
    process.exit(1);
  } finally {
    db.close((err) => {
      if (err) {
        console.error(' Error closing database:', err.message);
      } else {
        console.log(' Database connection closed');
      }
    });
  }
}

seed();