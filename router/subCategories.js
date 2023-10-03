require('../db/conn');
const jwt=require('jsonwebtoken');
const express= require('express');
const bcrypt=require('bcryptjs');
const router=express.Router();
const multer = require('multer');
const path = require('path');
require('../db/conn');
const SubCategory =require("../model/SubCategoriesSchema");
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

  // Endpoint to handle form submission
  router.post('/addSubCategory', (req, res) => {
    const { subCategoryTitle, catId, } = req.body;
    console.log("sub"+req.body)
    const newData = new SubCategory({
        subCategoryId: 'subCat'+generateUniqueId(),
        subCategoryTitle: subCategoryTitle,
        catId:catId,
        subCategoryPublished:true,
        subCategoryDate: new Date(),
    });
  
    newData.save()
      .then(data => {
        console.log('Data saved to MongoDB:', data);
        res.status(200).json({ message: 'Form data added successfully.' });
      })
      .catch(err => {
        console.error('Error saving data to MongoDB:', err);
        res.status(500).json({ error: 'Failed to save form data .' });
      });
  });



  router.get('/getAllSubCategorys', async (req, res) => {
    try {
      const SubCategorys = await SubCategory.find({}).populate('catId'); // Fetch all SubCategorys from the database
      
      console.log("This is the SubCategory information:", SubCategorys);
      
      res.json( SubCategorys ); // Send the SubCategorys as JSON response
    } catch (error) {
      console.error("Error fetching SubCategorys:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  router.get('/getOneSubCategory/:id', async (req, res) => {
    const  SubCategoryId  = req.params.id;
  console.log("getOne",SubCategoryId)
  console.log("get",req.params.id)
    try {
      const SubCategoryone = await SubCategory.findOne({subCategoryId:SubCategoryId}).populate('catId'); // Fetch the SubCategory based on the provided ID
      
      if (!SubCategoryone) {
        return res.status(404).json({ error: "SubCategory not found" });
      }
      
      console.log("SubCategory information for ID", SubCategoryId, ":", SubCategoryone);
      
      res.json({ SubCategoryone }); // Send the SubCategory as JSON response
    } catch (error) {
      console.error("Error fetching SubCategory:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



router.put('/updateSubCategory/:SubCategoryId', async (req, res) => {
  const { subCategoryTitle, catId } = req.body;
  const SubCategoryId = req.params.SubCategoryId;

  try {

   
    const result = await SubCategory.updateOne(
      { subCategoryId: SubCategoryId },
      {
        $set: {
            subCategoryTitle: subCategoryTitle,
            catId: catId,
        },
      }
    );

    if (result.n === 0) {
      return res.status(404).json({ error: 'SubCategory not found' });
    }

    res.status(200).json({ message: 'SubCategory updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  router.delete('/deleteSubCategory/:SubCategoryId', async (req, res) => {
    const SubCategoryId = req.params.SubCategoryId;
    try {
      const deletedSubCategory = await SubCategory.findOneAndDelete({ subCategoryId: SubCategoryId });
      if (!deletedSubCategory) {
        return res.status(404).json({ error: 'SubCategory not found' });
      }
      res.status(200).json({ message: 'SubCategory deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
module.exports=router;


