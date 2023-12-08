require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const path = require('path');

const WhichLists = require('../model/WhichListSchema');

router.post('/CreateWhichlist', async (req, res) => {
    const { productId, UserId } = req.body;

    if (!productId || !UserId) {
        return res.status(400).json({ error: "productId or UserId is not provided" });
    }

    try {
        const WhichList = new WhichLists({
            UserId: UserId,
            ProductId: productId
        });

        const WhichListsSave = await WhichList.save();
        res.json(WhichListsSave);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/Whichlist/:userId', async (req, res) => {
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
router.delete('/removeWishlist/:ProductId', async (req, res) => {
    const ProductID = req.params.ProductId;
    try {
      const deletedWishList = await WhichLists.findOneAndDelete({ ProductId : ProductID });
      if (!deletedWishList) {
        return res.status(404).json({ error: 'wishlist not found' });
      }
      res.status(200).json({ message: 'wishlist deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;