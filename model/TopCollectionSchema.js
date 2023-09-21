const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const TopCollectionSchema = new mongoose.Schema({

    TopCollectionTitle: {
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
    TopCollectionStartDate: {
        type: String
    },
    TopCollectionEndDate: {
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
