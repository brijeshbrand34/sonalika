const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const  PagesSchema= new mongoose.Schema({
    PagesId: { type: String, required: true , unique: true, },
    PagesTitle: { type: String, required: true },
    PagesLink: { type: String, required: true },
    PagesDescription: { type: {String} },
   
},{
    timestamps:true  
})


const Pages = mongoose.model('Pages', PagesSchema);
module.exports = Pages;