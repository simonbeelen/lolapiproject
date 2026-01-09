const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'lol.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS champions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            title TEXT NOT NULL,
            role TEXT NOT NULL,
            difficulty INTEGER NOT NULL CHECK(difficulty >= 1 AND difficulty <= 10),
            release_date TEXT NOT NULL,
            lore TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            cost INTEGER NOT NULL CHECK(cost >= 0),
            category TEXT NOT NULL,
            stats TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Database tables created/verified');
});

module.exports = db;