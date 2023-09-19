const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const CatSchema= new mongoose.Schema({

catTitle:{
type:String,
},
brand:{
    type:String,
    },
    
catPublished:{
    type:Boolean,
    },
    
catImage:{
    type:[String],
   
},
catId:{
    type:String,
},
catDate:{
    type: Date
},

});


const Cat=mongoose.model('Cat',CatSchema);
module.exports=Cat;
