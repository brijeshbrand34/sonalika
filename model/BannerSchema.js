const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const BannerSchema= new mongoose.Schema({

BannerTitle:{
type:String,
//required:true
},
BannerDescription:{
type:String,
//required:true
},
BannerImage:{
    type:[String],
    //required:true
},
BannerLink:{
    type:String,
    //required:true
},
BannerId:{
    type:String,
    //required:true
},
BannerDate:{
    type: Date
},

});


const Banner=mongoose.model('Banner',BannerSchema);
module.exports=Banner;
