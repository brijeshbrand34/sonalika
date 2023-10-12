require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const multer = require('multer');
const path = require('path');
require('../db/conn');
const Cat = require('../model/CategoriesSchema');
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
router.post('/addCat', upload.array('catImage'), (req, res) => {
  const {
    catTitle,
    brand
  } = req.body;
  const currentDate = new Date();

  const fileNames = req.files?.map(file => file.filename);
  console.log(fileNames)
  const newData = new Cat({
    catId: 'cat' + generateUniqueId(),
    brand: brand,
    catTitle: catTitle,
    catPublished: true,
    catImage: fileNames,
    catDate: currentDate
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



router.get('/getAllCats', async (req, res) => {
  try {
    const Cats = await Cat.find({}); // Fetch all Cats from the database

    console.log("This is the Cat information:", Cats);

    res.json(Cats); // Send the Cats as JSON response
  } catch (error) {
    console.error("Error fetching Cats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get('/getOneCat/:id', async (req, res) => {
  const CatId = req.params.id;
  try {
    const categorie = await Cat.findOne({ catId: CatId });
     // Fetch the Cat based on the provided ID
    console.log(categorie);
    if (!categorie) {
      return res.status(404).json({ error: "Cat not found" });
    }

    console.log("Cat information for ID", CatId, ":", categorie);

    res.json({ categorie }); // Send the Cat as JSON response
  } catch (error) {
    console.error("Error fetching Cat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.put('/updateCategory/:CatId', upload.array('catImage'), async (req, res) => {
  const { catTitle, brand,
    catPublished } = req.body;
  const CatId = req.params.CatId;
  const currentDate = new Date();
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const fileNames = req.files.map((file) => file.filename);

    const result = await Cat.updateOne(
      { catId: CatId },
      {
        $set: {
          catTitle: catTitle,
          catPublished: catPublished,
          brand: brand,
          catImage: fileNames,
          catDate: currentDate
        },
      }
    );

    if (result.n === 0) {
      return res.status(404).json({ error: 'Cat not found' });
    }

    res.status(200).json({ message: 'Cat updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





router.delete('/deleteCat/:CatId', async (req, res) => {
  const CatId = req.params.CatId;
  try {
    const deletedCat = await Cat.findOneAndDelete({ catId: CatId });
    if (!deletedCat) {
      return res.status(404).json({ error: 'Cat not found' });
    }
    res.status(200).json({ message: 'Cat deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/publishCategory/:CatId', async (req, res) => {
  const { published } = req.body;
  const CatID = req.params.CatId;

  try {
    const result = await Cat.updateOne(
      { CatId: CatID },
      {
        $set: {
          catPublished: published,
        },
      }
    );
    console.log("result-----", result);

    if (result.n === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category published update successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;