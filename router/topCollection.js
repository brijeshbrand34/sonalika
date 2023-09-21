require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const multer = require('multer');
const path = require('path');
require('../db/conn');
const TopCollection = require('../model/TopCollectionSchema');
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
router.post('/addTopCollection', upload.array('TopCollectionImage'), (req, res) => {
    const { TopCollectionTitle, TopCollectionStartdate, TopCollectionEnddate } = req.body;
    const fileNames = req.files?.map(file => file.filename);
    console.log(fileNames)
    const newData = new TopCollection({
        TopCollectionId: 'TopCollection' + generateUniqueId(),
        TopCollectionTitle: TopCollectionTitle,
        TopCollectionStartDate: TopCollectionStartdate,
        TopCollectionImage: fileNames,
        TopCollectionEndDate: TopCollectionEnddate
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
router.get('/getAllTopCollection', async (req, res) => {
    try {
        const TopCollections = await TopCollection.find({}); 
        console.log("This is the Banner information:", TopCollections);
        res.json(TopCollections); 
    } catch (error) {
        console.error("Error fetching Banners:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
);

//   Get One TopCollection
router.get('/getOneTopCollection/:TopCollectionId', async (req, res) => {
    const TopCollectionID = req.params.TopCollectionId;
    console.log("getOne", TopCollectionId)
    console.log("get", req.params.TopCollectionId)
    try {
        const TopCollect = await TopCollection.findOne({TopCollectionId : TopCollectionID }); 

        if (!TopCollect) {
            return res.status(404).json({ error: "FeatureProduct not found" });
        }
        console.log("TopCollection information for ID", TopCollectionId, ":", TopCollect);
        res.json({ TopCollect });
    } catch (error) {
        console.error("Error fetching TopCollection:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update topCollection 
router.put('/update/TopCollection/:TopCollectionId', upload.array('TopCollectionImage'), async (req, res) => {
    const { TopCollectionTitle, TopCollectionStartdate, TopCollectionenddate } = req.body;
    const TopCollectionID = req.params.TopCollectionId;
    console.log(TopCollectionID);
    try {
        if (!req.files || !req.files.length) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }
        const fileNames = req.files.map((file) => file.filename);
        const result = await TopCollection.updateOne(
            { TopCollectionId : TopCollectionID },
            {
                $set: {
                    TopCollectionTitle: TopCollectionTitle,
                    TopCollectionStarDate: TopCollectionStartdate,
                    TopCollectionEndDate: TopCollectionenddate,
                    TopCollectionImage: fileNames,
                },
            }
        );
        console.log(result);
        if (result.n === 0) {
            return res.status(404).json({ error: 'TopCollection not found' });
        }
        res.status(200).json({ message: 'TopCollection updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete top Collection 
router.delete('/deleteTopCollection/:TopCollectionId', async (req, res) => {
    const TopCollectionID = req.params.TopCollectionId;
    try {
      const deletedTopCollection = await TopCollection.findOneAndDelete({ TopCollectionId : TopCollectionID });
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