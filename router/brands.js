require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const multer = require("multer");
const path = require("path");
require("../db/conn");
const Brand = require("../model/BrandsSchema");
function generateUniqueId() {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const uniqueId = `${year}${month}${day}${hours}${minutes}${seconds}`;

  return uniqueId;
}

const storage = multer.diskStorage({
  destination: "./backend/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Endpoint to handle form submission
router.post("/addBrand", upload.array("brandImage"), (req, res) => {
  const { brandTitle } = req.body;
  const currentDate = new Date();

  const fileNames = req.files?.map((file) => file.filename);
  console.log(fileNames);
  const newData = new Brand({
    brandId: "bnr" + generateUniqueId(),
    brandTitle: brandTitle,
    brandPublished: true,
    brandImage: fileNames,
    brandDate: currentDate,
  });

  newData
    .save()
    .then((data) => {
      console.log("Data saved to MongoDB:", data);
      res
        .status(200)
        .json({ message: "Form data and files uploaded successfully." });
    })
    .catch((err) => {
      console.error("Error saving data to MongoDB:", err);
      res.status(500).json({ error: "Failed to save form data and files." });
    });
});

router.get("/getAllBrands", async (req, res) => {
  try {
    const Brands = await Brand.find({}); // Fetch all Brands from the database

    console.log("This is the Brand information:", Brands);

    res.json(Brands); // Send the Brands as JSON response
  } catch (error) {
    console.error("Error fetching Brands:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getOneBrand/:id", async (req, res) => {
  const brandId = req.params.id;
  try {
    const OneBrand = await Brand.findOne({ brandId: brandId }); // Fetch the Brand based on the provided ID

    if (!Brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    console.log("Brand information for ID", brandId, ":", OneBrand);

    res.json({ OneBrand }); // Send the Brand as JSON response
  } catch (error) {
    console.error("Error fetching Brand:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put(
  "/Brand/update/:BrandId",
  upload.array("brandImage"),
  async (req, res) => {
    const { brandTitle, brandPublished,brandImage } = req.body;
    const BrandId = req.params.BrandId;
    const currentDate = new Date();
    const fileNames = req.files.map((file) => file.filename);
    try {
      if (!req.files || !req.files.length) {
        const result = await Brand.updateOne(
          { brandId: BrandId },
          {
            $set: {
              brandTitle: brandTitle,
              brandPublished: brandPublished,
              brandImage: brandImage,
              brandDate: currentDate,
            },
          }
        );

        if (result.n === 0) {
          return res.status(404).json({ error: "Brand not found" });
        }

        return res.status(200).json({ message: "Brand  updated with image successfully" });

        // return res.status(400).json({ error: 'No files uploaded.' });
      }

      const result = await Brand.updateOne(
        { brandId: BrandId },
        {
          $set: {
            brandTitle: brandTitle,
            brandPublished: brandPublished,
            brandImage: fileNames,
            brandDate: currentDate,
          },
        }
      );

      if (result.n === 0) {
        return res.status(404).json({ error: "Brand not found" });
      }

      res.status(200).json({ message: "Brand updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/deleteBrand/:BrandId", async (req, res) => {
  const BrandId = req.params.BrandId;
  try {
    const deletedBrand = await Brand.findOneAndDelete({ brandId: BrandId });
    if (!deletedBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
