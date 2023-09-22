const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ShortVideoSchema = new mongoose.Schema({

  
    ShartVideoVideo: {
        type: [String],
        //required:true
    },
    ShartVideoId: {
        type: String,
        unique: true,
        //required:true
    },
    ShartVideoPublished: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
ShartVideoSchema.index({ ShartVideoId: 1 }, { unique: true });

const ShartVideo = mongoose.model('ShartVideo', ShortVideoSchema);
module.exports = ShartVideo;
