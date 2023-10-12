require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const multer = require('multer');
const path = require('path');
require('../db/conn');
const HomeAds = require('../model/HomeAdsSchema');
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

// TopCollection Api to create 
router.post('/addHomeAds', upload.array('HomeAdsImage'), (req, res) => {
    const { HomeAdsTitle,HomeAdsDiscription,HomeAdsLink,HomeAdsStartdate, HomeAdsEnddate } = req.body;
    const fileNames = req.files?.map(file => file.filename);
    console.log(fileNames)
    const newData = new HomeAds({
        HomeAdsId: 'HomeAds' + generateUniqueId(),
        HomeAdsTitle: HomeAdsTitle,
        HomeAdsDiscription:HomeAdsDiscription,
        HomeAdsLink: HomeAdsLink,
        HomeAdsStartDate: HomeAdsStartdate,
        HomeAdsImage: fileNames,
        HomeAdsEndDate: HomeAdsEnddate
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

//   Get app TopCollection 
router.get('/getAllHomeAds', async (req, res) => {
    try {
        const AllHomeAds = await HomeAds.find({}); 
        console.log("This is the Banner information:", AllHomeAds);
        res.json(AllHomeAds); 
    } catch (error) {
        console.error("Error fetching Banners:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
);

//   Get One TopCollection
router.get('/getOneHomeAds/:HomeAdsId', async (req, res) => {
    const HomeAdsID = req.params.HomeAdsId;
    console.log("getOne", HomeAdsID)
    console.log("get", req.params.HomeAdsId)
    try {
            HomeAd = await HomeAds.findOne({HomeAdsId : HomeAdsID }); 

        if (!HomeAd) {
            return res.status(404).json({ error: "HomeAds not found" });
        }
        console.log("HomeAds information for ID", HomeAdsID, ":", HomeAd);
        res.json({ HomeAd });
    } catch (error) {
        console.error("Error fetching HomeAds:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update topCollection 
router.put('/update/HomeAds/:HomeAdsId', upload.array('HomeAdsImage'), async (req, res) => {
    const { HomeAdsTitle, HomeAdsLink,HomeAdsStartdate, HomeAdsenddate } = req.body;
    const HomeAdsID = req.params.TopCollectionId;
    console.log(HomeAdsID);
    try {
        if (!req.files || !req.files.length) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }
        const fileNames = req.files.map((file) => file.filename);
        const result = await HomeAds.updateOne(
            { HomeAdsId : HomeAdsID },
            {
                $set: {
                    HomeAdsTitle: HomeAdsTitle,
                    HomeAdsLink: HomeAdsLink,
                    TopCollectionStarDate: HomeAdsStartdate,
                    HomeAdsEndDate: HomeAdsenddate,
                    HomeAdsImage: fileNames,
                },
            }
        );
        console.log(result);
        if (result.n === 0) {
            return res.status(404).json({ error: 'HomeAds not found' });
        }
        res.status(200).json({ message: 'HomeAds updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete top Collection 
router.delete('/deleteHomeAds/:HomeAdsId', async (req, res) => {
    const HomeAdsId = req.params.HomeAdsId;
    console.log(HomeAdsId,'HomeAdsId')
    try {
      const deletedTopCollection = await HomeAds.findOneAndDelete({ HomeAdsId : HomeAdsId });
      if (!deletedTopCollection) {
        return res.status(404).json({ error: 'TopCollection not found' });
      }
      res.status(200).json({ message: 'TopCollection deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  module.exports = router;