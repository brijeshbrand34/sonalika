require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const multer = require('multer');
const path = require('path');
require('../db/conn');
const PopUp = require('../model/PopUpSchema');
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

router.post('/addpopup', upload.array('PopupImage'), (req, res) => {
    const { PopupTitle, PopupLink,Popupdelay } = req.body;
    const fileNames = req.files?.map(file => file.filename);
    console.log(fileNames)
    const newData = new PopUp({
        PopupId: 'popup' + generateUniqueId(),
        PopupTitle: PopupTitle,
        PopupLink: PopupLink,
        PopupImage: fileNames,
        Popupdelay: Popupdelay,
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
// Api for get all popups 
router.get('/getAllpopup', async (req, res) => {
    try {
        const PopUps = await PopUp.find({}); // Fetch all Banners from the database
  
        console.log("This is the Banner information:", PopUps);
  
        res.json(PopUps); // Send the Banners as JSON response
    } catch (error) {
        console.error("Error fetching Banners:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

// Get Single popup 
router.get('/getOnePopUp/:id', async (req, res) => {
    const PopUpId = req.params.id;
    console.log("getOne", PopUpId)
    console.log("get", req.params.id)
    try {
      const popup = await PopUp.findOne({ PopupId: PopUpId }); 
  
      if (!popup) {
        return res.status(404).json({ error: "Banner not found" });
      }
  
      console.log("Popup information for ID", PopUpIdId, ":", popup);
  
      res.json({ popup }); 
    } catch (error) {
      console.error("Error fetching popup:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// update popup
router.put('/updatepopup/:popupId', upload.array('PopupImage'), async (req, res) => {
    const { PopupTitle, PopupLink,Popupdelay } = req.body;
    const PopupId = req.params.popupId;
  
    try {
      if (!req.files || !req.files.length) {
        return res.status(400).json({ error: 'No files uploaded.' });
      }
  
      const fileNames = req.files.map((file) => file.filename);
  
      const result = await PopUp.updateOne(
        { PopupId: PopupId },
        {
          $set: {
            PopupTitle: PopupTitle,
            PopupLink: PopupLink,
            PopupImage: fileNames,
            Popupdelay:Popupdelay,
          },
        }
      );
  
      if (result.n === 0) {
        return res.status(404).json({ error: 'PopUp not found' });
      }
      res.status(200).json({ message: 'PopUp updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/deletepopup/:popupId', async (req, res) => {
    const popupID = req.params.popupId;
    try {
      const deletedpopup = await PopUp.findOneAndDelete({ PopupId : popupID });
      if (!deletedpopup) {
        return res.status(404).json({ error: 'PopUp not found' });
      }
      res.status(200).json({ message: 'PopUp deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // To publish the products
router.put('/publishUp/:popUpId', async (req, res) => {
  const { published } = req.body;
  const PopupId = req.params.popUpId;

  try {
    const result = await PopUp.updateOne(
      { PopupId: PopupId },
      {
        $set: {
          PopupPublish: published,
        },
      }
    );

    console.log("result-----", result);

    if (result.n === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product published successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;