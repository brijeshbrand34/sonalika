


const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    ReviewId: {
      type: String,
      required: true,
    },
    review_rating: {
      type: String,
      required: true,
    },
    review_text: {
      type: String,
      required: true,
    },
    product_id: {
      type: String,
      required: true,
    },
    customer_id: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true,
    },
   
    ReviewDate: {
      type: Date,
      default: Date.UTC,
    },
  },
  
);

const Reviews = mongoose.model("Reviews", ReviewSchema);
module.exports = Reviews;
