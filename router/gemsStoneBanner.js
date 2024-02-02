require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const multer = require("multer");
const path = require("path");
require("../db/conn");
const GemsStoneBanner = require("../model/gemsStoneBannerSchema");
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
router.get('/gemstonebanner',upload.none(),async(req,res)=>{
    try {
        const banner =await GemsStoneBanner.find({})
    
        res.status(200).json({message:'all banner get successfully',banner:banner})
    } catch (error) {
        res.status(500).json({message:'something went wrong'})
    }
})
router.post(
  "/gemstonebanner",
  upload.single("gemsBanner"),
  async (req, res) => {
    const filename = req.file;
    const {gemsDesc}=req.body
    try {
      console.log(filename);
      if (!filename) {
        res.status(400).json({ message: "Banner Is required" });
      }
      const newData = new GemsStoneBanner({
        gemsBanner: filename.filename,
        gemsDesc:gemsDesc
      });
      await newData.save();
      res.status(200).json({ message: "Banner Save Successfully" });
    } catch (error) {
      res.status(500).json({ error: "something went wrong" });
    }
  }
);
router.put(
  "/gemstonebanner/:Id",
  upload.single("gemsBanner"),
  async (req, res) => {
    const file = req.file;
    const BannerId = req.params.Id;
    const {gemsDesc}=req.body
    try {
      const banner = await GemsStoneBanner.findOne({ _id: BannerId });
      if (!banner) {
        res.status(400).json({ message: "Banner Not Found" });
      }
      if (banner) {
        if (file) {
          banner.gemsBanner = file.filename;
        }
        banner.gemsDesc=gemsDesc
        await banner.save();
        res.status(200).json({ message: "updated sucsessfully" });
      }
    } catch (error) {
      res.status(500).json({ message: "Something Went Wrong" });
    }
  }
);
module.exports = router;
