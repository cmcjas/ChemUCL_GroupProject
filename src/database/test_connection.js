// src/database/test_connection.js
const pool = require('./connection'); // This assumes your pool export is in connection.js

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connection successful:', res.rows[0]);
  }
  pool.end(); // close the pool if this is just a test script
});
