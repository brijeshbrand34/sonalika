const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    CartId: {
      type: String,
      // required: true,
    },
    cart:{type:Object},
    products:[{
      ProductId:{
        type: String,
        // required: true,
      },
      product_imageId: {
      type: String,
      // required: true,
    },
    productName: {
      type: String,
      // required: true,
    },
    quantity: {
      type: Number,
      // required: true,
    },
    productPrice:{
      type:Number,
      //required:true
  },
  
    
  }],
  CartDate: {
    type: String,
    // default: Date.UTC,
  },
  customer_id: {
    type: String,
    // required: true,
  },
  customer_email: {
    type: String,
    // required: true,
  }
 

  },
  
  
);


const Carts = mongoose.model("Carts", CartSchema);
module.exports = Carts;



