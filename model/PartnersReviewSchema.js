const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const PartnersReviewSchema = new mongoose.Schema({
    PartnersReviewId: { type: String, required: true , unique: true, },
    PartnersReviewName: { type: String, required: true },
    PartnersReview: { type: String, required: true },
    PartnersReviewImage: { type: {String} },
    PartnersReviewPublished: { type: Boolean,default: false}
},{
    timestamps:true  
})


const PartnersReview = mongoose.model('PartnersReview', PartnersReviewSchema);
module.exports = PartnersReview;