const mongoose = require('mongoose');

const CareersSchema = new mongoose.Schema({
    CareersId: { type: String, required: true , unique: true, },
    CareersTitle: { type: String, required: true },
    CareersLink: { type: String, required: true },
    CareersDescription: { type: String, required: true },
},{
    timestamps:true  
})

const Careers = mongoose.model('Careers', CareersSchema);
module.exports = Careers;