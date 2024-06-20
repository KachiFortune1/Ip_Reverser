const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log('Connected to the SQLite database.');
});

const createTable = `
    CREATE TABLE IF NOT EXISTS ip_addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reversed_ip TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`;

db.run(createTable, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log('Table created or already exists.');
});

db.close((err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log('Closed the database connection.');
});
