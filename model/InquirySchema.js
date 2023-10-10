const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema(
    {
        InquiryID:{type:String , required:true,  unique: true, },
        UserName:{type:String,  required: true},
        UserNumber:{type: Number,  required: true},
        ProductName:{type:String, equired: true},
        UserEmail:{type:Number, required: true,},
        City:{type:String,  required: true},
        ZipCode:{type:Number,  required: true}

    })
    const Inquiry = mongoose.model("Inquiry", InquirySchema);
    module.exports = Inquiry;