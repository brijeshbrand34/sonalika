const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const ProductSchema= new mongoose.Schema({

productId:{
        type:String,
        //required:true
    },

productTitle:{
    type:String,
    //required:true
},
productCategory:{
    type:String,
    //required:true
},
productBrand:{
    type:String,
    //required:true
},
productTags:{
    type:String,
    //required:true
},
productShortDescription:{
    type:String,
    //required:true
},
productDescription:{
    type:String,
    //required:true
},

productMainImage:{
    type:[String],
    // type:String,
    //required:true
},
productPrice:{
    type:Number,
    //required:true
},

productStock:{
    type:Number,
    //required:true
},

productSkuCode:{
    type:String,
    //required:true
},
featuredDeals:{
    type:String,
    //required:true
},
newCollection:{
    type:String,
    //required:true
},
dealsOfTheWeek:{
    type:String,
    //required:true
},
published:{
    type:Boolean,
    //required:true
},
productDate:{
    type: Date,
    

},

});


const Product=mongoose.model('Product',ProductSchema);
module.exports=Product;
