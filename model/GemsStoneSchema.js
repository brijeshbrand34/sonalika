const mongoose = require('mongoose');
    const GemsStoneSchema = new mongoose.Schema({
        GemsId:{type:String, required:true},
        GemsTilte:{type:String, required:true},
        GemsDiscription:{type:String, required:true},
        GemsImage:{type:String, required:true},
        GemsPublished:{type:Boolean, default:true},
    },{
        timestamps:true,
    })
    const GemsStones = mongoose.model("GemsStones", GemsStoneSchema);
    module.exports = GemsStones;