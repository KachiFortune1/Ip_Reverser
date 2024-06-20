const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log('Connected to the SQLite database.');
});

app.get('/', async (req, res) => {
    try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const publicIp = ipResponse.data.ip;
        const reversedIp = publicIp.split('').reverse().join('');

        const insertQuery = `INSERT INTO ip_addresses (reversed_ip) VALUES (?)`;
        db.run(insertQuery, [reversedIp], function(err) {
            if (err) {
                console.error('Error inserting data:', err.message);
                return res.status(500).send('Internal Server Error');
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });

        res.send(`Reversed IP: ${reversedIp}`);
    } catch (error) {
        console.error('Error fetching IP:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});
