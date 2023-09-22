require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const multer = require('multer');
const path = require('path');
require('../db/conn');
const ShartVideo = require('../model/ShortVideoSchema');
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

// Short Video Api to create 
router.post('/addShartVideo', upload.array('ShartVideoVideo'), (req, res) => {
    const fileNames = req.files?.map(file => file.filename);
    console.log(fileNames)
    const newData = new ShartVideo({
        ShartVideoId: 'ShartVideo' + generateUniqueId(),
        ShartVideoVideo: fileNames,
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

//   Get all Short Video 
router.get('/getAllShartVideo', async (req, res) => {
    try {
        const ShartVideos = await ShartVideo.find({}); 
        console.log("This is the Short Video information:", ShartVideo);
        res.json(ShartVideos); 
    } catch (error) {
        console.error("Error fetching Short Video:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
);

//   Get One Shart video
router.get('/getOneShartVideo/:ShartVideoId', async (req, res) => {
    const ShartVideoID = req.params.ShartVideoId;
    console.log("getOne", ShartVideoId)
    console.log("get", req.params.ShartVideoId)
    try {
        const ShortVideoGet = await ShartVideo.findOne({ShartVideoId : ShartVideoID }); 

        if (!ShortVideoGet) {
            return res.status(404).json({ error: "FeatureProduct not found" });
        }
        console.log("TopCollection information for ID", ShartVideoId, ":", ShortVideoGet);
        res.json({ ShortVideoGet });
    } catch (error) {
        console.error("Error fetching TopCollection:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update Short video 
router.put('/update/ShartVideo/:ShartVideoId', upload.array('ShartVideoImage'), async (req, res) => {
    const ShartVideoID = req.params.ShartVideoId;
    console.log(ShartVideoID);
    try {
        if (!req.files || !req.files.length) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }
        const fileNames = req.files.map((file) => file.filename);
        const result = await ShartVideo.updateOne(
            { ShartVideoId : ShartVideoID },
            {
                $set: {
                    
                    ShartVideoVideo: fileNames,
                },
            }
        );
        console.log(result);
        if (result.n === 0) {
            return res.status(404).json({ error: 'ShartVideo not found' });
        }
        res.status(200).json({ message: 'ShartVideo updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete top Short video 
router.delete('/deleteShartVideo/:ShartVideoId', async (req, res) => {
    const ShartVideoID = req.params.ShartVideoId;
    try {
      const deletedShartVideo = await ShartVideo.findOneAndDelete({ ShartVideoId : ShartVideoID });
      if (!deletedShartVideo) {
        return res.status(404).json({ error: 'ShartVideo not found' });
      }
      res.status(200).json({ message: 'ShartVideo deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  module.exports = router;