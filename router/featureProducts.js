require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const multer = require('multer');
const path = require('path');
require('../db/conn');
const FeatureProducts = require('../model/FeatureProductsSchema');
function generateUniqueId() {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const uniqueId = `${year}${month}${day}${hours}${minutes}${seconds}`;

    return uniqueId;
}


const storage = multer.diskStorage({
    destination: './backend/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// BlogBanner Api to create 
router.post('/addFeatureProducts', upload.array('FeatureProductsImage'), (req, res) => {
    const { FeatureProductsTitle, FeatureProductsStartdate, FeatureProductsEnddate } = req.body;
    const fileNames = req.files?.map(file => file.filename);
    console.log(fileNames)
    const newData = new FeatureProducts({
        FeatureProductsId: 'FeatureProducts' + generateUniqueId(),
        FeatureProductsTitle: FeatureProductsTitle,
        FeatureProductsStartDate: FeatureProductsStartdate,
        FeatureProductsImage: fileNames,
        FeatureProductsEndDate: FeatureProductsEnddate
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

//   Get app blogbanner 
router.get('/getAllFeatureProducts', async (req, res) => {
    try {
        const FeatureProduct = await FeatureProducts.find({}); // Fetch all Banners from the database
        console.log("This is the Banner information:", FeatureProduct);
        res.json(FeatureProduct); // Send the Banners as JSON response
    } catch (error) {
        console.error("Error fetching Banners:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
);

//   Get One Blog Banner
router.get('/getOneFeatureProducts/:id', async (req, res) => {
    const FeatureProductsID = req.params.id;
    console.log("getOne", FeatureProductsID)
    console.log("get", req.params.id)
    try {
        const FeatureProduct = await FeatureProducts.findOne({FeatureProductsId : FeatureProductsID }); // Fetch the Banner based on the provided ID

        if (!FeatureProduct) {
            return res.status(404).json({ error: "FeatureProduct not found" });
        }
        console.log("FeatureProduct information for ID", FeatureProductId, ":", FeatureProduct);
        res.json({ FeatureProduct }); // Send the Banner as JSON response
    } catch (error) {
        console.error("Error fetching FeatureProduct:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put('/update/FeatureProducts/:FeatureProductsId', upload.array('FeatureProductsImage'), async (req, res) => {
    const { FeatureProductsTitle, FeatureProductsStartdate, FeatureProductsenddate } = req.body;
    const FeatureProductsID = req.params.FeatureProductsId;
    try {
        if (!req.files || !req.files.length) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }
        const fileNames = req.files.map((file) => file.filename);
        const result = await FeatureProducts.updateOne(
            { FeatureProductsId : FeatureProductsID },
            {
                $set: {
                    FeatureProductsTitle: FeatureProductsTitle,
                    FeatureProductsStarDate: FeatureProductsStartdate,
                    FeatureProductsEndDate: FeatureProductsenddate,
                    FeatureProductsImage: fileNames,
                },
            }
        );
        if (result.n === 0) {
            return res.status(404).json({ error: 'FeatureProducts not found' });
        }
        res.status(200).json({ message: 'FeatureProducts updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/deleteFeatureProducts/:FeatureProductsId', async (req, res) => {
    const FeatureProductsID = req.params.FeatureProductsId;
    try {
      const deletedFeatureProducts = await FeatureProducts.findOneAndDelete({ FeatureProductsId : FeatureProductsID });
      if (!deletedFeatureProducts) {
        return res.status(404).json({ error: 'FeatureProducts not found' });
      }
      res.status(200).json({ message: 'FeatureProducts deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.put('/publishFeatureProducts/:FeatureProductsId', async (req, res) => {
    const { published } = req.body;
    const FeatureProductsID = req.params.FeatureProductsId;
  
    try {
      const result = await FeatureProducts.updateOne(
        { FeatureProductsId: FeatureProductsID },
        {
          $set: {
            FeatureProductsPublished: published,
          },
        }
      );
      console.log("result-----", result);
  
      if (result.n === 0) {
        return res.status(404).json({ error: 'FeatureProducts not found' });
      }
  
      res.status(200).json({ message: 'FeatureProducts published update successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  module.exports = router;