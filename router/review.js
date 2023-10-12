require("../db/conn");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
require("../db/conn");
const Review = require("../model/ReviewSchema");
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

router.post("/reviewAdd", async (req, res) => {
  const {
    review_rating,
    review_text,
    product_id,
    customer_id,
    customer_email,
  } = req.body;
  console.log(req.body);

  try {
    const user = new Review({
      review_rating: review_rating,
      review_text: review_text,
      product_id: product_id,
      customer_id: customer_id,
      customer_email: customer_email,
      ReviewId: "rev" + generateUniqueId(),
      ReviewDate: new Date(),
    });
    await user.save();
    res.status(201).json({
      message: "review register successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/ReviewGet", async (req, res) => {
  try {
    const Reviews = await Review.find({}); // Fetch all Reviews from the database

    console.log("This is the Review information:", Reviews);

    res.json(Reviews); // Send the Reviews as JSON response
  } catch (error) {
    console.error("Error fetching Reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/ReviewGetOne/:id", async (req, res) => {
  const ReviewId = req.params.id;
  console.log("getOne", ReviewId);
  console.log("get", req.params.id);
  try {
    const SingleReview = await Review.findOne({ ReviewId: ReviewId }); // Fetch the Review based on the provided ID

    if (!SingleReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    console.log("Review information for ID", ReviewId, ":", SingleReview);

    res.json({ SingleReview }); // Send the Review as JSON response
  } catch (error) {
    console.error("Error fetching Review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/ReviewUpdate/:ReviewId", async (req, res) => {
  const ReviewId = req.params.ReviewId;
  const updates = req.body;
  console.log(updates,'update')

  try {
    const result = await Review.updateOne(
      { ReviewId: ReviewId },
      { $set: updates }
    );

    if (result.n === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/ReviewDelete/:ReviewId", async (req, res) => {
  const ReviewId = req.params.ReviewId;
  try {
    const deletedReview = await Review.findOneAndDelete({ ReviewId: ReviewId });
    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get('/Reviewproduct/:productId', async (req, res) => {
  const ReviewproductId = req.params.productId;
  try {
    const Reviews = await Review.find({ Product_id: ReviewproductId }); // Fetch the Review based on the provided ID

    if (!Review) {
      return res.status(404).json({ error: "Review not found" });
    }

    console.log("Review information for ID", ReviewproductId, ":", Reviews);

    res.json({ Reviews }); // Send the Review as JSON response
  } catch (error) {
    console.error("Error fetching Review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
