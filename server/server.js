const express = require('express');
const importInventory = require('../db/queries/import-inventory'); 

const app = express();
app.use(express.json()); 

app.post('/db/queries/import-inventory', async (req, res) => {
    try {
        const results = await importInventory(req.body.chemicalDataArray, req.body.locationDataArray);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error inserting data into the database:', error);
        res.status(500).json({ error: 'An error occurred while inserting data into the database' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});