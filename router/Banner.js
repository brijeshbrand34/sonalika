require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const multer = require('multer');
const path = require('path');
require('../db/conn');
const Banner = require('../model/BannerSchema');
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

// Endpoint to handle form submission
router.post('/addBanner', upload.array('BannerImage'), (req, res) => {
  const { BannerTitle, BannerLink,BannerDescription } = req.body;
  const fileNames = req.files?.map(file => file.filename);
  console.log(fileNames)
  const newData = new Banner({
    BannerId: 'bnr' + generateUniqueId(),
    BannerTitle: BannerTitle,
    BannerLink: BannerLink,
    BannerDescription:BannerDescription,
    BannerImage: fileNames,
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



router.get('/getAllBanners', async (req, res) => {
  try {
      const Banners = await Banner.find({}); // Fetch all Banners from the database

      console.log("This is the Banner information:", Banners);

      res.json(Banners); // Send the Banners as JSON response
  } catch (error) {
      console.error("Error fetching Banners:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);


router.get('/getOneBanner/:id', async (req, res) => {
  const BannerId = req.params.id;
  console.log("getOne", BannerId)
  console.log("get", req.params.id)
  try {
    const banner = await Banner.findOne({ BannerId: BannerId }); // Fetch the Banner based on the provided ID

    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    console.log("Banner information for ID", BannerId, ":", banner);

    res.json({ banner }); // Send the Banner as JSON response
  } catch (error) {
    console.error("Error fetching Banner:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.put('/update/:BannerId', upload.array('BannerImage'), async (req, res) => {

  console.log(req.body)
  const { BannerTitle, BannerLink,BannerDescription,BannerImage } = req.body;
  const BannerId = req.params.BannerId;
  const fileNames = req.files.map((file) => file.filename);
  try {
    if (!req.files || !req.files.length) {

      const result = await Banner.updateOne(
        { BannerId: BannerId },
        {
          $set: {
            BannerTitle: BannerTitle,
            BannerLink: BannerLink,
            BannerDescription:BannerDescription,
            BannerImage: BannerImage,
          },
        }
      );
  
      if (result.n === 0) {
        return res.status(404).json({ error: 'Banner not found' });
      }
  
      return res.status(200).json({ message: 'Banner updated with image successfully' });
    }
    

    const result = await Banner.updateOne(
      { BannerId: BannerId },
      {
        $set: {
          BannerTitle: BannerTitle,
          BannerLink: BannerLink,
          BannerDescription:BannerDescription,
          BannerImage: fileNames?fileNames:BannerImage,
        },
      }
    );

    if (result.n === 0) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.status(200).json({ message: 'Banner updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





router.delete('/deleteBanner/:BannerId', async (req, res) => {
  const BannerId = req.params.BannerId;
  try {
    const deletedBanner = await Banner.findOneAndDelete({ BannerId: BannerId });
    if (!deletedBanner) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


