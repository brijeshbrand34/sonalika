const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const TopCollectionSchema = new mongoose.Schema({


    TopCollectionLink: {
        type: String,
        //required:true
    },

    TopCollectionImage: {
        type: [String],
        //required:true
    },
    TopCollectionId: {
        type: String,
        unique: true,
        //required:true
    },
    CatagoryId: {
        type: String
    },
    TopCollectionPublished: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
TopCollectionSchema.index({ TopCollectionId: 1 }, { unique: true });

const TopCollection = mongoose.model('TopCollection', TopCollectionSchema);
module.exports = TopCollection;
