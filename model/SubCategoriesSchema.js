const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const SubCategorySchema= new mongoose.Schema({

subCategoryTitle:{
type:String,
//required:true
},
catId:{
    type:String,
    //required:true
},

subCategoryPublished:{
    type:Boolean,
    //required:true
},
subCategoryId:{
    type:String,
    //required:true
},
subCategoryDate:{
    type: Date
},

});


const SubCategory=mongoose.model('SubCategory',SubCategorySchema);
module.exports=SubCategory;
