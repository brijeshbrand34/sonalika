const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema(
    {
        InquiryId:{type:String , 
            // required:true,
              unique: true, },
        UserName:{type:String, 
            //  required: true
            },
        UserNumber:{type: Number, 
            
            // required: true
        },
        ProductName:{type:String, 
            // required: true
        },
        UserEmail:{type:String, 
            // required: true,
        },
        City:{type:String, 
            //  required: true
            },
        ZipCode:{type:Number, 
            //  required: true
            },
        description:{type:String,  

            // required: true
        },

    })
    const Inquiry = mongoose.model("Inquiry", InquirySchema);
    module.exports = Inquiry;