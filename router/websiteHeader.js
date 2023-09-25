require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
require('../db/conn');
const WebsiteHeader = require('../model/WebsiteHeaderSchema');


const storage = multer.diskStorage({
  destination: './backend/uploads/',
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


router.put('/websiteheaderImage/:Id', upload.array('websiteheaderImage'), async (req, res) => {
    const { Email, MobileNunber } = req.body;
    const WebsiteHeaderId = req.params.Id;
    const currentDate = new Date();
    try {
      if (!req.files || !req.files.length) {
        return res.status(400).json({ error: 'No files uploaded.' });
      }
  
      const fileNames = req.files.map((file) => file.filename);
  
      const result = await WebsiteHeader.updateOne(
        { _Id: WebsiteHeaderId},
        {
          $set: {
            Email: Email,
            MobileNunber: MobileNunber,
            Image: fileNames,
          },
        }
      );
  
      if (result.n === 0) {
        return res.status(404).json({ error: 'Websiteheader  not found' });
      }
  
      res.status(200).json({ message: 'Websiteheader updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error ' });
    }
  });

  module.exports = router;