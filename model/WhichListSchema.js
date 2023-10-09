const mongoose = require('mongoose');

const WhichListSchema = new mongoose.Schema(
    {
        UserId:{type:String},
        ProductId:{type:String}
    })
    
WhichLists=mongoose.model("WhichList", WhichListSchema);
module.exports = WhichLists;
