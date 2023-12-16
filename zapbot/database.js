const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/data.db');

// Create a users table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            userid TEXT UNIQUE,
            username TEXT,
            discriminator TEXT,
            date INTEGER,
            permissions INTEGER
        )
    `);

    console.log('Database table users created. ✅');
});

db.close();
