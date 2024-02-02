require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const multer = require("multer");
const path = require("path");
require("../db/conn");
const GemsStones = require("../model/GemsStoneSchema");
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

router.post("/GemsStonesadd", upload.array("gemsImage"), (req, res) => {
  const { GemsTilte, GemsDiscription } = req.body;
  const currentDate = new Date();
  console.log(req.files);
  const fileNames = req.files?.map((file) => file.filename);
  console.log(fileNames);
  const newData = new GemsStones({
    GemsId: "Gems" + generateUniqueId(),
    GemsTilte: GemsTilte,
    GemsDiscription: GemsDiscription,
    GemsPublished: true,
    GemsImage: fileNames,
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

router.get("/Get-all-GemsStones", async (req, res) => {
  try {
    const GemsStone = await GemsStones.find({}); // Fetch all Reviews from the database

    console.log("This is the GemsStones information:", GemsStone);

    res.json(GemsStone); // Send the Reviews as JSON response
  } catch (error) {
    console.error("Error fetching GemsStones:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/Get-one-GemsStones/:GemsId", async (req, res) => {
  const GemsId = req.params.GemsId;
  console.log("getOne", GemsId);
  console.log("get", req.params.id);
  try {
    const GemsStone = await GemsStones.findOne({ GemsId: GemsId });

    if (!GemsStone) {
      return res.status(404).json({ error: "GemsStone not found" });
    }

    console.log("GemsStone information for ID", GemsId, ":", GemsStone);

    res.json({ GemsStone }); // Send the Review as JSON response
  } catch (error) {
    console.error("Error fetching GemsStone:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put(
  "/update/GemsStone/:GemsId",
  upload.array("GemsImage"),
  async (req, res) => {
    const { GemsTilte, GemsDiscription, GemsImage } = req.body;
    const GemsID = req.params.GemsId;
    const fileNames = req.files?.map((file) => file.filename);

    try {
      if (!req.files || !req.files.length) {
        const result = await GemsStones.updateOne(
          { GemsId: GemsID },
          {
            $set: {
              GemsTilte: GemsTilte,
              GemsDiscription: GemsDiscription,
              GemsImage: GemsImage,
            },
          }
        );

        if (result.n === 0) {
          return res.status(404).json({ error: "Brand not found" });
        }

        return res
          .status(200)
          .json({ message: "Brand  updated with image successfully" });

        // return res.status(400).json({ error: 'No files uploaded.' });
      }
    
      const result = await GemsStones.updateOne(
        { GemsId: GemsID },
        {
          $set: {
            GemsTilte: GemsTilte,
            GemsDiscription: GemsDiscription,
            GemsImage: fileNames,
          },
        }
      );
      console.log(result);
      if (result.n === 0) {
        return res.status(404).json({ error: "GemsStones not found" });
      }
      res.status(200).json({ message: "GemsStones updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/GemsStonesDelete/:GemsId", async (req, res) => {
  const GemsID = req.params.GemsId;
  try {
    const deletedGems = await GemsStones.findOneAndDelete({ GemsID: GemsID });
    if (!deletedGems) {
      return res.status(404).json({ error: "Gems not found" });
    }
    res.status(200).json({ message: "Gems deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
