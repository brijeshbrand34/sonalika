require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const path = require('path');

const WhichList = require('../model/WhichListSchema');

router.post('/CreateWhichlist', async (req, res) => {
    const {productId , Userid} =req.body
    try{
        if(!productId || !Userid){
            res.json("productId  Userid is not find")
        }
        WhichLists = new WhichList({
            UserId:Userid,
            ProductId:productId
        })
        console.log(WhichLists)
        WhichListsSave= await WhichLists.save();
        res.json(WhichListsSave);
    }catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/ReviewGetOne/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log("getOne", userId)
    console.log("get", req.params.userId)
    try {
      const WhichList = await WhichList.find({ UserId: userId }); // Fetch the Review based on the provided ID
  
      if (!WhichList) {
        return res.status(404).json({ error: "WhichList not found" });
      }
  
      console.log("WhichList information for ID", UserId, ":", WhichList);
  
      res.json({ WhichList }); // Send the Review as JSON response
    } catch (error) {
      console.error("Error fetching WhichList:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  module.exports = router;