require('../db/conn');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const path = require('path');
const Coupons = require('../model/CouponsSchema');
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

router.post('/CouponsAdd', async (req, res) => {
    const { CouponCode, DiscountAmount, CouponsStartDate, CouponsEndDate, Categories } = req.body;
    try {
        const Discounts = new Coupons({
            CouponCode,
            DiscountAmount,
            CouponsStartDate,
            CouponsEndDate,
            Categories, CouponsId: 'Coupon' + generateUniqueId(),
        });
        console.log(Discounts)
        await Discounts.save();
        res.status(201).json({
            message: 'Coupons register successfully'
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    };
});

router.get('/GetAllCoupons', async (req, res) => {
    try {
        const Coupon = await Coupons.find({});
        console.log("This is the Coupons information:", Coupon);
        res.json(Coupons); // Send the Reviews as JSON response
    } catch (error) {
        console.error("Error fetching Coupons:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get('/CouponGetOne/:id', async (req, res) => {
    const CouponsId = req.params.id;
    console.log("getOne", CouponsId)
    console.log("get", req.params.id)
    try {
        const Coupon = await Coupons.findOne({ CouponsId: CouponsId });
        if (!Coupon) {
            return res.status(404).json({ error: "Coupon not found" });
        }
        console.log("Coupon information for ID", CouponsId, ":", Coupon);
        res.json({ Coupon }); // Send the Review as JSON response
    } catch (error) {
        console.error("Error fetching Coupon:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/CouponUpdate/:CouponId', async (req, res) => {
    const CouponsId = req.params.CouponId;
    const updates = req.body;
  
    try {
      const result = await Coupons.updateOne({ CouponsId: CouponsId }, { $set: updates });
  
      if (result.n === 0) {
        return res.status(404).json({ error: 'Coupons not found' });
      }
  
      res.status(200).json({ message: 'CouponsId updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.delete('/CouponDelete/:CouponId', async (req, res) => {
    const CouponsId = req.params.Coupons;
    try {
      const deletedCoupons = await Coupons.findOneAndDelete({ CouponsId: CouponsId });
      if (!deletedCoupons) {
        return res.status(404).json({ error: 'Coupons not found' });
      }
      res.status(200).json({ message: 'Coupons deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;