const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const BrandSchema= new mongoose.Schema({

brandTitle:{
type:String,
//required:true
},
brandPublished:{
    type:Boolean,
    //required:true
    },
    
brandImage:{
    type:[String],
    //required:true
},
brandId:{
    type:String,
    //required:true
},
brandDate:{
    type: Date
},

});


const Brand=mongoose.model('Brand',BrandSchema);
module.exports=Brand;
