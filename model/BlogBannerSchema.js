const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const BlogBannerSchema = new mongoose.Schema({

    BlogBannerTitle: {
        type: String,
        //required:true
    },
    BlogBannerImage: {
        type: [String],
        //required:true
    },
    BlogBannerId: {
        type: String,
        unique: true,
        //required:true
    },
    BlogBannerStartDate: {
        type: String
    },
    BlogBannerEndDate: {
        type: String
    },
    BlogBannerPublished: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});


const BlogBanner = mongoose.model('BlogBanner', BlogBannerSchema);
module.exports = BlogBanner;
