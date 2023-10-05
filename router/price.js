require('../db/conn');
const express = require('express');
const router = express.Router();
const Prices = require('../model/PriceSchema');

router.post('/addprice', (req, res) => {
    const { Goldprice, sliverprice, Dimondprice,Date } = req.body;
    
    const newData = new Prices({
        
        GoldPrice: Goldprice,
        SliverPrice: sliverprice,
        DimondPrice: Dimondprice,
        Date:Date,
    });

    newData.save()
        .then(data => {
            console.log('Data saved to MongoDB:', data);
            res.status(200).json({ message: 'Form data and files uploaded successfully.' });
        })
        .catch(err => {
            console.error('Error saving data to MongoDB:', err);
            res.status(500).json({ error: 'Failed to save form data and files.' });
        });
});

router.get('/getAllPrices', async (req, res) => {
    try {
        const AllPrices = await Prices.find({});
        console.log("This is the Prices information:", AllPrices);
        res.json(AllPrices);
    } catch (error) {
        console.error("Error fetching AllPrices:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
