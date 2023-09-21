const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const OrderSchema= new mongoose.Schema({

userFirstName:{
type:String,
//required:true
},
userLastName:{
    type:String,
    //required:true
    },
    userMobileNo:{
        type:Number,
        //required:true 
        },
    userEmail:{
    type:String,
    //required:true
},
userZipcode:{
    type:Number,
    //required:true
},
userRegion:{
    type:String,
    //required:true
},
userAddress1:{
    type:String,
    //required:true
},

userAddress2:{
    type:String,
    //required:true
},
//--------------------order related
orderId:{
    type:String,
    unique: true
    //required:true
},
orderDate:{
    type: Date,
    

},

orderTotalCost:{
    type:Number,
    //required:true
},
statusOfOrder:{
    type:String,
    //required:true
},
paymentStatus:{
    type:String,
    //required:true
},
products:[{
    ProductId:{
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
    type: Number
    },
 productTotalPrice:{
      type: Number
      },
 
}],
totalPrice:{
    type: Number
    },

});


const Order=mongoose.model('Order',OrderSchema);
module.exports=Order;


