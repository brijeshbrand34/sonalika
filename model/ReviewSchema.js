


const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    ReviewId: {
      type: String,
      required: true,
    },
    Review_rating: {
      type: String,
      required: true,
    },
    Review_text: {
      type: String,
      required: true,
    },
    Product_id: {
      type: String,
      required: true,
    },
    Customer_id: {
      type: String,
      required: true,
    },
    Customer_email: {
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
