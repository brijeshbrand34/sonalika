const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const BlogSchema= new mongoose.Schema({

blogTitle:{
type:String,
//required:true
},
blogImage:{
    // type:String,
    type:[String],
    //required:true
},
blogIntroduction:{
type:String,
//required:true 
},
blogText:{
    type:String,
    //required:true
},
blogConclusion:{
    type:String,
    //required:true
},
BlogId:{
    type:String,
    //required:true
},
BlogDate:{
    type: Date,
},

});


const Blog=mongoose.model('Blog',BlogSchema);
module.exports=Blog;
